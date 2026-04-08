import { Router } from "express";
import crypto from "crypto";
import { query } from "../lib/db.js";
import { hashPassword, verifyPassword, signToken, requireAuth } from "../lib/auth.js";
import { sendEmail, welcomeEmail, passwordResetEmail } from "../lib/mailer.js";

const router = Router();

function mapRole(role: string): string {
  const m: Record<string, string> = {
    startup: "STARTUP", founder: "STARTUP",
    investor: "INVESTOR",
    provider: "PROVIDER",
    enthusiast: "ENTHUSIAST",
    admin: "ADMIN",
  };
  return m[role.toLowerCase()] || "ENTHUSIAST";
}

function frontendRole(dbRole: string): string {
  const m: Record<string, string> = {
    STARTUP: "startup", INVESTOR: "investor",
    PROVIDER: "provider", ENTHUSIAST: "enthusiast", ADMIN: "admin",
  };
  return m[dbRole] || "enthusiast";
}

function logActivity(userId: string | null, action: string, metadata?: object, ip?: string) {
  query(
    "INSERT INTO activity_log (user_id, action, metadata, ip) VALUES ($1, $2, $3, $4)",
    [userId, action, metadata ? JSON.stringify(metadata) : null, ip || null]
  ).catch(() => {});
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, whatsappActive, sector } = req.body;
    if (!name || !email || !password || !role) {
      res.status(400).json({ error: "name, email, password, and role are required" });
      return;
    }
    const existing = await query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existing.rows.length) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }
    const dbRole = mapRole(role);
    const hash = hashPassword(password);
    const result = await query(
      `INSERT INTO users (email, full_name, role, password_hash, phone, whatsapp_active, sector, status, onboarding_complete)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', false)
       RETURNING id, email, full_name, role, status, phone, whatsapp_active, sector, onboarding_complete`,
      [email.toLowerCase(), name, dbRole, hash, phone || null, whatsappActive || false, sector || null]
    );
    const user = result.rows[0];
    logActivity(user.id, "register", { role: dbRole }, req.ip);
    await sendEmail(user.email, "Welcome to Project Zenith — Pending Review", welcomeEmail(name, role));
    res.status(201).json({
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: frontendRole(user.role),
        status: user.status,
        phone: user.phone,
        whatsappActive: user.whatsapp_active,
        sector: user.sector,
        onboardingComplete: user.onboarding_complete,
        profile: {},
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }
    const result = await query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    if (!result.rows.length) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const user = result.rows[0];
    if (!verifyPassword(password, user.password_hash || "")) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    if (user.status === "rejected") {
      res.status(403).json({ error: "rejected", message: user.rejection_reason || "Your account was not approved." });
      return;
    }
    const token = signToken(user.id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await query(
      "INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, token, expiresAt]
    );
    logActivity(user.id, "login", {}, req.ip);

    const profileResult = await query(
      "SELECT field_path, proposed_value FROM profile_changes WHERE user_id = $1 AND status = 'approved'",
      [user.id]
    );
    const profile: Record<string, string> = {};
    profileResult.rows.forEach(r => { profile[r.field_path] = r.proposed_value; });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: frontendRole(user.role),
        status: user.status,
        phone: user.phone,
        whatsappActive: user.whatsapp_active,
        sector: user.sector,
        onboardingComplete: user.onboarding_complete,
        profile,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// POST /api/auth/logout
router.post("/logout", requireAuth as any, async (req, res) => {
  const auth = req.headers.authorization!.slice(7);
  await query("DELETE FROM sessions WHERE token = $1", [auth]).catch(() => {});
  res.json({ ok: true });
});

// GET /api/auth/me
router.get("/me", requireAuth as any, async (req, res) => {
  const user = (req as any).authUser;
  const profileResult = await query(
    "SELECT field_path, proposed_value FROM profile_changes WHERE user_id = $1 AND status = 'approved'",
    [user.id]
  );
  const profile: Record<string, string> = {};
  profileResult.rows.forEach((r: any) => { profile[r.field_path] = r.proposed_value; });
  res.json({
    user: {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: frontendRole(user.role),
      status: user.status,
      phone: user.phone,
      whatsappActive: user.whatsapp_active,
      sector: user.sector,
      onboardingComplete: user.onboarding_complete,
      profile,
    },
  });
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) { res.status(400).json({ error: "email is required" }); return; }
    const result = await query("SELECT id, full_name, email FROM users WHERE email = $1", [email.toLowerCase()]);
    // Always return success to prevent email enumeration
    if (!result.rows.length) { res.json({ ok: true }); return; }
    const user = result.rows[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await query(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, token, expiresAt]
    );
    const baseUrl = req.headers.origin || "https://startid.io";
    await sendEmail(
      user.email,
      "Reset your Project Zenith password",
      passwordResetEmail(user.full_name, token, baseUrl)
    );
    logActivity(user.id, "forgot_password", {}, req.ip);
    res.json({ ok: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to process request" });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) { res.status(400).json({ error: "token and password are required" }); return; }
    if (password.length < 8) { res.status(400).json({ error: "Password must be at least 8 characters" }); return; }
    const result = await query(
      "SELECT * FROM password_resets WHERE token = $1 AND used_at IS NULL AND expires_at > NOW()",
      [token]
    );
    if (!result.rows.length) { res.status(400).json({ error: "Invalid or expired reset link" }); return; }
    const reset = result.rows[0];
    const hash = hashPassword(password);
    await query("UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2", [hash, reset.user_id]);
    await query("UPDATE password_resets SET used_at = NOW() WHERE id = $1", [reset.id]);
    logActivity(reset.user_id, "password_reset", {}, req.ip);
    res.json({ ok: true });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// PATCH /api/auth/complete-onboarding
router.patch("/complete-onboarding", requireAuth as any, async (req, res) => {
  const user = (req as any).authUser;
  await query("UPDATE users SET onboarding_complete = true, updated_at = NOW() WHERE id = $1", [user.id]);
  res.json({ ok: true });
});

export default router;
