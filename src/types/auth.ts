export type UserRole = "Admin" | "Staff" | "Customer";

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  cccd?: string;
  nationality?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiredAt: string;
  userId: number;
  customerId?: number | null;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  roleName?: string;
  avatar?: string | null;
}

export interface UserProfileResponse {
  userId: number;
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  avatar?: string | null;
  roleId: number;
  roleName?: string | null;
  customerId?: number | null;
  cccd?: string | null;
  nationality?: string | null;
  createAt?: string | null;
  updateAt?: string | null;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AuthUser {
  userId: number;
  fullName: string;
  email: string;
  roleName: UserRole | string;
  phoneNumber?: string | null;
  avatar?: string | null;
  customerId?: number | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginDto) => Promise<LoginResponse>;
  register: (data: RegisterDto) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}