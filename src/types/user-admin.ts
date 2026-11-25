export interface AdminUserDto {
    userId: number;
    fullName: string | null;
    email: string | null;
    roleId: number;
    roleName: string | null;
    isLocked: number;
    gender: string | number | null;
    dateOfBirth: string | null;
    phoneNumber: string | null;
    avatar: string | null;
    isDeleted: number;
}

export interface UserCreateDto {
    fullName: string;
    email: string;
    hashPassword: string;
    roleId: number;
    gender: string | null;
    dateOfBirth: string | null;
    phoneNumber: string;
}

export interface CustomerCreateDto {
    cccd: string;
    nationality: string;
}

export interface UserCreateRequestDto {
    user: UserCreateDto;
    customer?: CustomerCreateDto | null;
    avatar?: File | null;
}

export interface UserRoleOption {
    roleId: number;
    roleName: string;
}
