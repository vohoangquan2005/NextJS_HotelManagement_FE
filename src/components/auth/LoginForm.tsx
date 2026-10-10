"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Hotel, Loader2, Mail, Lock, ArrowLeft } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormFields } from "@/hooks/useFormFields";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { LoginDto, LoginResponse } from "@/types/auth";

const initialValues: LoginDto = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { login } = useAuth();

  const { values, handleChange } =
    useFormFields<LoginDto>(initialValues);

  const { loading, error, handleSubmit } = useFormSubmit<
    LoginDto,
    LoginResponse
  >(login, {
    onSuccess: (response) => {
      // Giữ nguyên logic điều hướng theo redirect và vai trò
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (response.roleName === "Admin") {
        router.push("/admin/dashboard");
      } else if (response.roleName === "Staff") {
        router.push("/staff/dashboard");
      } else {
        router.push("/");
      }
    },
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await handleSubmit(values);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Về trang chủ
          </Link>

          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Hotel className="size-6" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Đăng nhập tài khoản
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Nhập email và mật khẩu để tiếp tục
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider"
            >
              Email
            </Label>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="email"
                placeholder="example@gmail.com"
                className="h-11 rounded-lg pl-10"
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider"
            >
              Mật khẩu
            </Label>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="current-password"
                placeholder="Nhập mật khẩu"
                className="h-11 rounded-lg pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 font-semibold transition"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
