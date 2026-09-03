// backend/src/utils/jwt.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRole } from '../types/domain';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET as string;
  const options: SignOptions = { expiresIn: '15m' };
  return jwt.sign(payload, secret, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET as string;
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign(payload, secret, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_ACCESS_SECRET as string;
  return jwt.verify(token, secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET as string;
  return jwt.verify(token, secret) as TokenPayload;
};