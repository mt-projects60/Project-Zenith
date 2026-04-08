import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { query } from "./db.js";

const JWT_SECRET = process.env.JWT_SECRET || "startid-dev-secret-2026";
const TOKEN_EXPIRY_DAYS = 7;

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: `${TOKEN_EXPIRY_DAYS}d` });
}

export function verifyToken(token: string): { sub: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string };
  } catch {
    return null;
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  const result = await query("SELECT * FROM users WHERE id = $1", [payload.sub]);
  if (!result.rows.length) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  (req as Request & { authUser: Record<string, unknown> }).authUser = result.rows[0];
  next();
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  await requireAuth(req, res, () => {
    const u = (req as Request & { authUser: Record<string, unknown> }).authUser;
    if (u?.role !== "ADMIN") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  });
}
