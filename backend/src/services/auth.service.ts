// backend/src/services/auth.service.ts
import { UserModel } from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { UserRole } from '../types/domain';

export class AuthService {
  public static async register(email: string, password: string) {
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw { statusCode: 409, message: 'User with this email already exists', code: 'EMAIL_EXISTS' };
    }

    const passwordHash = await hashPassword(password);
    const user = await UserModel.create({
      email: email.toLowerCase(),
      passwordHash,
      role: UserRole.USER,
      isVerified: true, // Configurable for auto-verification or email link check
    });

    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshTokenHash = await hashPassword(refreshToken);
    await user.save();

    return { user: { id: user._id, email: user.email, role: user.role }, accessToken, refreshToken };
  }

  public static async login(email: string, password: string) {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw { statusCode: 401, message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' };
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' };
    }

    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshTokenHash = await hashPassword(refreshToken);
    await user.save();

    return { user: { id: user._id, email: user.email, role: user.role }, accessToken, refreshToken };
  }

  public static async refreshTokens(token: string) {
    try {
      const payload = verifyRefreshToken(token);
      const user = await UserModel.findById(payload.userId);

      if (!user || !user.refreshTokenHash) {
        throw { statusCode: 401, message: 'Invalid refresh token', code: 'INVALID_TOKEN' };
      }

      const isValid = await comparePassword(token, user.refreshTokenHash);
      if (!isValid) {
        throw { statusCode: 401, message: 'Revoked or invalid refresh token', code: 'INVALID_TOKEN' };
      }

      const newPayload = { userId: user._id.toString(), email: user.email, role: user.role };
      const newAccessToken = generateAccessToken(newPayload);
      const newRefreshToken = generateRefreshToken(newPayload);

      user.refreshTokenHash = await hashPassword(newRefreshToken);
      await user.save();

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw { statusCode: 401, message: 'Expired or invalid refresh token', code: 'INVALID_TOKEN' };
    }
  }

  public static async logout(userId: string) {
    await UserModel.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
  }
}