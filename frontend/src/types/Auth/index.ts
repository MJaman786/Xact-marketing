export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export type User = {
    _id: string,
    name: string,
    email: string,
    phone: string,
    role: UserRole,
    status: UserStatus,
    avatar: string | null,
    isEmailVerified: boolean,
    isPhoneVerified: boolean,
    lastLogin: string,
    createdAt: string,
    updatedAt: string
}

export interface AuthResponse {
    accessToken: string,
    user: User
}