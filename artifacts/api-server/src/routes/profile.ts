import { Router } from "express";
import { query } from "../lib/db.js";
import { requireAuth } from "../lib/auth.js";

const router = Router();

// GET /api/profile/pending-changes
router.get("/pending-changes", requireAuth as any, async (req, res) => {
  const user = (req as any).authUser;
  const result = await query(
    "SELECT * FROM profile_changes WHERE user_id = $1 ORDER BY created_at DESC",
    [user.id]
  );
  res.json({ changes: result.rows });
});

// POST /api/profile/submit-change
router.post("/submit-change", requireAuth as any, async (req, res) => {
  try {
    const user = (req as any).authUser;
    const { fieldPath, currentValue, proposedValue } = req.body;
    if (!fieldPath || proposedValue === undefined) {
      res.status(400).json({ error: "fieldPath and proposedValue are required" });
      return;
    }
    // Cancel any existing pending change for the same field
    await query(
      "UPDATE profile_changes SET status = 'cancelled' WHERE user_id = $1 AND field_path = $2 AND status = 'pending'",
      [user.id, fieldPath]
    );
    const result = await query(
      "INSERT INTO profile_changes (user_id, field_path, current_value, proposed_value, status) VALUES ($1, $2, $3, $4, 'pending') RETURNING *",
      [user.id, fieldPath, currentValue || null, proposedValue]
    );
    res.status(201).json({ change: result.rows[0] });
  } catch (err) {
    console.error("Submit change error:", err);
    res.status(500).json({ error: "Failed to submit change" });
  }
});

// POST /api/profile/submit-all — submit multiple fields at once (from onboarding/profile form)
router.post("/submit-all", requireAuth as any, async (req, res) => {
  try {
    const user = (req as any).authUser;
    const { fields } = req.body; // { fieldPath: proposedValue }
    if (!fields || typeof fields !== "object") {
      res.status(400).json({ error: "fields object is required" });
      return;
    }
    const entries = Object.entries(fields) as [string, string][];
    for (const [fieldPath, proposedValue] of entries) {
      await query(
        "UPDATE profile_changes SET status = 'cancelled' WHERE user_id = $1 AND field_path = $2 AND status = 'pending'",
        [user.id, fieldPath]
      );
      await query(
        "INSERT INTO profile_changes (user_id, field_path, proposed_value, status) VALUES ($1, $2, $3, 'pending')",
        [user.id, fieldPath, proposedValue]
      );
    }
    // Log activity
    await query(
      "INSERT INTO activity_log (user_id, action, metadata) VALUES ($1, 'profile_update', $2)",
      [user.id, JSON.stringify({ fieldCount: entries.length })]
    );
    res.json({ ok: true, submitted: entries.length });
  } catch (err) {
    console.error("Submit all error:", err);
    res.status(500).json({ error: "Failed to submit changes" });
  }
});

export default router;
