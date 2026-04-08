import { Router } from "express";
import { query } from "../lib/db.js";
import { requireAdmin } from "../lib/auth.js";
import { sendEmail, approvalEmail, rejectionEmail, profileChangeApprovedEmail, profileChangeRejectedEmail } from "../lib/mailer.js";

const router = Router();

// All admin routes require admin auth
router.use(requireAdmin as any);

// GET /api/admin/users — all users
router.get("/users", async (_req, res) => {
  const result = await query(
    `SELECT id, email, full_name, role, status, phone, whatsapp_active, sector, onboarding_complete, created_at, approved_at, rejection_reason
     FROM users ORDER BY created_at DESC`
  );
  res.json({ users: result.rows });
});

// GET /api/admin/users/pending — pending users
router.get("/users/pending", async (_req, res) => {
  const result = await query(
    `SELECT id, email, full_name, role, status, phone, whatsapp_active, sector, created_at
     FROM users WHERE status = 'pending' ORDER BY created_at DESC`
  );
  res.json({ users: result.rows });
});

// PATCH /api/admin/users/:id/approve
router.patch("/users/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `UPDATE users SET status = 'approved', approved_at = NOW(), updated_at = NOW()
       WHERE id = $1 RETURNING id, email, full_name, status`,
      [id]
    );
    if (!result.rows.length) { res.status(404).json({ error: "User not found" }); return; }
    const user = result.rows[0];
    await sendEmail(user.email, "Your Project Zenith profile has been approved!", approvalEmail(user.full_name));
    await query(
      "INSERT INTO activity_log (user_id, action, metadata) VALUES ($1, 'admin_approved_user', $2)",
      [id, JSON.stringify({ adminId: (req as any).authUser?.id })]
    );
    res.json({ ok: true, user });
  } catch (err) {
    console.error("Approve user error:", err);
    res.status(500).json({ error: "Failed to approve user" });
  }
});

// PATCH /api/admin/users/:id/reject
router.patch("/users/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const result = await query(
      `UPDATE users SET status = 'rejected', rejection_reason = $2, updated_at = NOW()
       WHERE id = $1 RETURNING id, email, full_name, status`,
      [id, reason || null]
    );
    if (!result.rows.length) { res.status(404).json({ error: "User not found" }); return; }
    const user = result.rows[0];
    await sendEmail(user.email, "Your Project Zenith application update", rejectionEmail(user.full_name, reason));
    await query(
      "INSERT INTO activity_log (user_id, action, metadata) VALUES ($1, 'admin_rejected_user', $2)",
      [id, JSON.stringify({ adminId: (req as any).authUser?.id, reason })]
    );
    res.json({ ok: true, user });
  } catch (err) {
    console.error("Reject user error:", err);
    res.status(500).json({ error: "Failed to reject user" });
  }
});

// GET /api/admin/profile-changes — all pending profile changes
router.get("/profile-changes", async (_req, res) => {
  const result = await query(
    `SELECT pc.*, u.full_name, u.email, u.role
     FROM profile_changes pc
     JOIN users u ON pc.user_id = u.id
     WHERE pc.status = 'pending'
     ORDER BY pc.created_at DESC`
  );
  res.json({ changes: result.rows });
});

// PATCH /api/admin/profile-changes/:id/approve
router.patch("/profile-changes/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).authUser?.id;
    const result = await query(
      `UPDATE profile_changes SET status = 'approved', reviewed_at = NOW(), reviewed_by = $2
       WHERE id = $1 RETURNING *, (SELECT email FROM users WHERE id = user_id) AS email, 
       (SELECT full_name FROM users WHERE id = user_id) AS full_name`,
      [id, adminId]
    );
    if (!result.rows.length) { res.status(404).json({ error: "Change not found" }); return; }
    const change = result.rows[0];
    await sendEmail(
      change.email,
      "Profile update approved — Project Zenith",
      profileChangeApprovedEmail(change.full_name, change.field_path)
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Approve change error:", err);
    res.status(500).json({ error: "Failed to approve change" });
  }
});

// PATCH /api/admin/profile-changes/:id/reject
router.patch("/profile-changes/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).authUser?.id;
    const result = await query(
      `UPDATE profile_changes SET status = 'rejected', reviewed_at = NOW(), reviewed_by = $2
       WHERE id = $1 RETURNING *, (SELECT email FROM users WHERE id = user_id) AS email,
       (SELECT full_name FROM users WHERE id = user_id) AS full_name`,
      [id, adminId]
    );
    if (!result.rows.length) { res.status(404).json({ error: "Change not found" }); return; }
    const change = result.rows[0];
    await sendEmail(
      change.email,
      "Profile update — Project Zenith",
      profileChangeRejectedEmail(change.full_name, change.field_path)
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Reject change error:", err);
    res.status(500).json({ error: "Failed to reject change" });
  }
});

// PATCH /api/admin/users/:id — edit user details
router.patch("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, sector, role, status } = req.body;
    const allowedRoles = ["STARTUP", "INVESTOR", "PROVIDER", "ENTHUSIAST"];
    const allowedStatuses = ["pending", "approved", "rejected", "suspended"];

    const sets: string[] = [];
    const vals: unknown[] = [];
    let idx = 1;

    if (full_name) { sets.push(`full_name = $${idx++}`); vals.push(full_name); }
    if (email) { sets.push(`email = $${idx++}`); vals.push(email.toLowerCase()); }
    if (sector !== undefined) { sets.push(`sector = $${idx++}`); vals.push(sector || null); }
    if (role && allowedRoles.includes(role.toUpperCase())) { sets.push(`role = $${idx++}`); vals.push(role.toUpperCase()); }
    if (status && allowedStatuses.includes(status)) { sets.push(`status = $${idx++}`); vals.push(status); }

    if (!sets.length) { res.status(400).json({ error: "No valid fields to update" }); return; }
    sets.push(`updated_at = NOW()`);
    vals.push(id);

    const result = await query(
      `UPDATE users SET ${sets.join(", ")} WHERE id = $${idx} RETURNING id, email, full_name, role, status, sector`,
      vals
    );
    if (!result.rows.length) { res.status(404).json({ error: "User not found" }); return; }
    await query(
      "INSERT INTO activity_log (user_id, action, metadata) VALUES ($1, 'admin_edited_user', $2)",
      [id, JSON.stringify({ adminId: (req as any).authUser?.id, fields: Object.keys(req.body) })]
    );
    res.json({ ok: true, user: result.rows[0] });
  } catch (err) {
    console.error("Edit user error:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// PATCH /api/admin/users/:id/suspend — toggle suspend/unsuspend
router.patch("/users/:id/suspend", async (req, res) => {
  try {
    const { id } = req.params;
    const current = await query("SELECT status FROM users WHERE id = $1", [id]);
    if (!current.rows.length) { res.status(404).json({ error: "User not found" }); return; }
    const newStatus = current.rows[0].status === "suspended" ? "approved" : "suspended";
    const result = await query(
      "UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, status, full_name",
      [newStatus, id]
    );
    await query(
      "INSERT INTO activity_log (user_id, action, metadata) VALUES ($1, $2, $3)",
      [id, newStatus === "suspended" ? "admin_suspended_user" : "admin_unsuspended_user",
       JSON.stringify({ adminId: (req as any).authUser?.id })]
    );
    res.json({ ok: true, user: result.rows[0] });
  } catch (err) {
    console.error("Suspend user error:", err);
    res.status(500).json({ error: "Failed to suspend user" });
  }
});

// GET /api/admin/activity — activity log
router.get("/activity", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 100, 500);
  const result = await query(
    `SELECT al.*, u.full_name, u.email, u.role
     FROM activity_log al
     LEFT JOIN users u ON al.user_id = u.id
     ORDER BY al.created_at DESC LIMIT $1`,
    [limit]
  );
  res.json({ activity: result.rows });
});

// GET /api/admin/emails — email queue log
router.get("/emails", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 100, 500);
  const result = await query(
    "SELECT * FROM email_queue ORDER BY created_at DESC LIMIT $1",
    [limit]
  );
  res.json({ emails: result.rows });
});

// GET /api/admin/stats — dashboard stats
router.get("/stats", async (_req, res) => {
  const [totalUsers, pendingUsers, approvedUsers, totalActivity] = await Promise.all([
    query("SELECT COUNT(*) FROM users WHERE role != 'ADMIN'"),
    query("SELECT COUNT(*) FROM users WHERE status = 'pending'"),
    query("SELECT COUNT(*) FROM users WHERE status = 'approved'"),
    query("SELECT COUNT(*) FROM activity_log"),
  ]);
  res.json({
    totalUsers: Number(totalUsers.rows[0].count),
    pendingUsers: Number(pendingUsers.rows[0].count),
    approvedUsers: Number(approvedUsers.rows[0].count),
    totalActivity: Number(totalActivity.rows[0].count),
  });
});

export default router;
