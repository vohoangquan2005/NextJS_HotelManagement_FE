import { fetchApi } from "./client";
import type {
  RegisterDto,
  LoginResponse,
  LoginDto,
  UserProfileResponse,
} from "@/types/auth";

export async function register(data: RegisterDto): Promise<LoginResponse> {
  return fetchApi<LoginResponse>("/Auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginDto): Promise<LoginResponse> {
  return fetchApi<LoginResponse>("/Auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getProfile(): Promise<UserProfileResponse> {
  return fetchApi<UserProfileResponse>("/Auth/profile", {
    method: "GET",
  });
}

export async function updateProfile(data: FormData): Promise<UserProfileResponse> {
  return fetchApi<UserProfileResponse>("/Auth/profile", {
    method: "PUT",
    body: data,
  });
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}): Promise<{ message?: string } | undefined> {
  return fetchApi<{ message?: string } | undefined>("/Auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logout(): Promise<{ message: string }> {
  return fetchApi<{ message: string }>("/Auth/logout", {
    method: "POST",
  });
}
