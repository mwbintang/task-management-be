import jwt from "jsonwebtoken"
import { env } from "../constants/env";
import { CustomJwtPayload } from "../constants/types/jwt.type";

/**
 * Generate a JWT token
 */
export function signToken(payload: object): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1HOURS" });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): string | CustomJwtPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}
