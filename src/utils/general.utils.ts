import { randomBytes } from 'crypto';

export const generateCode = (length: number = 8): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';

    const bytes = randomBytes(length);
    for (let i = 0; i < length; i++) {
        code += chars[bytes[i] % chars.length];
    }

    return code;
};
