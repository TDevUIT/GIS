export enum Role {
    ADMIN = 'ADMIN',
    SUPERVISOR = 'SUPERVISOR',
}

export interface User {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    role: Role;
    isActive: boolean;
    mustChangePassword?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken?: string;
    mustChangePassword: boolean;
    message: string;
}

export type CreateSupervisorDTO = Pick<User, 'email' | 'name' | 'phone'>;

export interface SetPasswordDTO {
    newPassword: string;
}

export interface ChangeRoleDTO {
    userId: string;
    role: Role.SUPERVISOR;
}
