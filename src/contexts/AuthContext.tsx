"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  login as apiLogin,
  register as apiRegister,
  getProfile as apiGetProfile,
  logout as apiLogout,
} from "@/app/api/auth.api";
import type {
  AuthContextType,
  AuthUser,
  LoginDto,
  LoginResponse,
  RegisterDto,
} from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "accessToken";
const USER_KEY = "hotel_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Khôi phục phiên đăng nhập khi load trang
  useEffect(() => {
    async function restoreSession() {
      try {
        const savedToken = localStorage.getItem(TOKEN_KEY);
        const savedUserJson = localStorage.getItem(USER_KEY);

        if (savedToken) {
          setToken(savedToken);
          if (savedUserJson) {
            try {
              const parsedUser: AuthUser = JSON.parse(savedUserJson);
              setUser(parsedUser);
            } catch {
              localStorage.removeItem(USER_KEY);
            }
          }

          // Kiểm tra và đồng bộ lại với Backend qua getProfile
          try {
            const profile = await apiGetProfile();
            const syncedUser: AuthUser = {
              userId: profile.userId,
              fullName: profile.fullName || "Người dùng",
              email: profile.email || "",
              roleName: profile.roleName || "Customer",
              phoneNumber: profile.phoneNumber,
              avatar: profile.avatar,
              customerId: profile.customerId,
            };
            setUser(syncedUser);
            localStorage.setItem(USER_KEY, JSON.stringify(syncedUser));
          } catch {
            // Token đã hết hạn hoặc không hợp lệ -> xóa sạch phiên
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setToken(null);
            setUser(null);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  // Xử lý đăng nhập
  const login = useCallback(
    async (data: LoginDto): Promise<LoginResponse> => {
      setIsLoading(true);
      try {
        const response = await apiLogin(data);
        const userObj: AuthUser = {
          userId: response.userId,
          fullName: response.fullName || response.email || "Người dùng",
          email: response.email || data.email,
          roleName: response.roleName || "Customer",
          phoneNumber: response.phoneNumber,
          avatar: response.avatar,
          customerId: response.customerId,
        };

        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(userObj));

        setToken(response.token);
        setUser(userObj);

        return response;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Xử lý đăng ký
  const register = useCallback(
    async (data: RegisterDto): Promise<LoginResponse> => {
      setIsLoading(true);
      try {
        const response = await apiRegister(data);
        const userObj: AuthUser = {
          userId: response.userId,
          fullName: response.fullName || data.fullName,
          email: response.email || data.email,
          roleName: response.roleName || "Customer",
          phoneNumber: response.phoneNumber || data.phoneNumber,
          avatar: response.avatar,
          customerId: response.customerId,
        };

        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(userObj));

        setToken(response.token);
        setUser(userObj);

        return response;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Xử lý đăng xuất
  const logout = useCallback(async (): Promise<void> => {
    try {
      await apiLogout();
    } catch {
      // Dù API logout trả lỗi gì thì client vẫn xóa phiên
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  // Làm mới thông tin hồ sơ
  const refreshProfile = useCallback(async (): Promise<void> => {
    try {
      const profile = await apiGetProfile();
      const updatedUser: AuthUser = {
        userId: profile.userId,
        fullName: profile.fullName || "Người dùng",
        email: profile.email || "",
        roleName: profile.roleName || "Customer",
        phoneNumber: profile.phoneNumber,
        avatar: profile.avatar,
        customerId: profile.customerId,
      };
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    } catch {
      await logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
