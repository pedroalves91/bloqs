import { UserRole } from '../../users/enums';

export interface JwtPayload {
    id: string;
    email: string;
    role: UserRole;
}
