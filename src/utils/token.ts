import jwt from 'jsonwebtoken';
import type { Role } from '../validations/request.validation';

export interface JWTPayload {
  id: string;
  role: Role,
  email: string
}

const JWT_SECRET = process.env.JWT_SECRET!;

export function createUserToken(payload: JWTPayload): string {
  const token = jwt.sign(payload, JWT_SECRET);
  return token;
}

export function decodeUserToken(token: string): JWTPayload {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
}