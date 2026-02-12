import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface JWTPayload {
    userId: number;
    email: string;
    role: 'student' | 'teacher';
}

export const generateToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JWTPayload | null => {
    try {
        console.log('[Auth] Verifying token, JWT_SECRET exists:', !!JWT_SECRET);
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        console.log('[Auth] Token verified successfully:', decoded);
        return decoded;
    } catch (error) {
        console.error('[Auth] Token verification failed:', error);
        return null;
    }
};

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
};

export const comparePassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};
