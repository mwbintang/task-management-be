import jwt, { JwtPayload } from "jsonwebtoken"
import { env } from "../constants/env";

/**
 * Generate a JWT token
 */
export function signToken(payload: object): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1HOURS" });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): string | JwtPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}
