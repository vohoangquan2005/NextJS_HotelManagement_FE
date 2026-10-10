"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Đang xác thực thông tin tài khoản...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Kiểm tra vai trò
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.some(
      (role) => role.toLowerCase() === user.roleName.toLowerCase()
    );

    if (!hasRole) {
      return (
        <div className="flex min-h-[70vh] w-full items-center justify-center p-4">
          <div className="mx-auto max-w-md rounded-2xl border border-destructive/20 bg-card p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <ShieldAlert className="size-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Không có quyền truy cập
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tài khoản của bạn ({user.fullName}) đang có vai trò{" "}
              <span className="font-semibold text-primary">{user.roleName}</span>, không
              đủ thẩm quyền để truy cập vào trang này.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className={buttonVariants({ variant: "outline" })}
              >
                <ArrowLeft className="mr-2 size-4" />
                Về trang chủ
              </Link>
              {user.roleName === "Admin" && (
                <Link
                  href="/admin/dashboard"
                  className={buttonVariants({ variant: "default" })}
                >
                  Vào Dashboard Quản trị
                </Link>
              )}
              {user.roleName === "Staff" && (
                <Link
                  href="/staff/dashboard"
                  className={buttonVariants({ variant: "default" })}
                >
                  Vào Dashboard Nhân viên
                </Link>
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
