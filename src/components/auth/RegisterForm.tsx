"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Hotel,
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  ArrowLeft,
  CreditCard,
  Globe,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormFields } from "@/hooks/useFormFields";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { RegisterDto, LoginResponse } from "@/types/auth";

const initialValues: RegisterDto = {
  fullName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  cccd: "",
  nationality: "Việt Nam",
};

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const { values, handleChange } =
    useFormFields<RegisterDto>(initialValues);

  const { loading, error, setError, handleSubmit } = useFormSubmit<
    RegisterDto,
    LoginResponse
  >(register, {
    onSuccess: () => {
      router.push("/");
    },
  });

  const passwordChecks = [
    {
      label: "Ít nhất 6 ký tự",
      valid: values.password.length >= 6,
    },
    {
      label: "Chữ hoa (A-Z)",
      valid: /[A-Z]/.test(values.password),
    },
    {
      label: "Chữ thường (a-z)",
      valid: /[a-z]/.test(values.password),
    },
    {
      label: "Chữ số (0-9)",
      valid: /[0-9]/.test(values.password),
    },
  ];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (values.password !== values.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (values.password.length < 6) {
      setError("Mật khẩu phải có tối thiểu 6 ký tự!");
      return;
    }

    await handleSubmit(values);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl border bg-card p-8 shadow-xl">
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
            Đăng ký tài khoản
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Trải nghiệm dịch vụ đặt phòng trực tuyến tiện lợi
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
          {/* Họ tên */}
          <div className="space-y-1.5">
            <Label
              htmlFor="fullName"
              className="text-xs font-semibold uppercase tracking-wider"
            >
              Họ và tên
            </Label>

            <div className="relative">
              <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={values.fullName}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Nguyễn Văn A"
                className="h-11 rounded-lg pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  placeholder="name@gmail.com"
                  className="h-11 rounded-lg pl-10"
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="space-y-1.5">
              <Label
                htmlFor="phoneNumber"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Số điện thoại
              </Label>

              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="tel"
                  placeholder="0912345678"
                  className="h-11 rounded-lg pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* CCCD */}
            <div className="space-y-1.5">
              <Label
                htmlFor="cccd"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                CCCD / CMND (tùy chọn)
              </Label>

              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="cccd"
                  name="cccd"
                  type="text"
                  value={values.cccd ?? ""}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="00120100..."
                  className="h-11 rounded-lg pl-10"
                />
              </div>
            </div>

            {/* Quốc tịch */}
            <div className="space-y-1.5">
              <Label
                htmlFor="nationality"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Quốc tịch
              </Label>

              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="nationality"
                  name="nationality"
                  type="text"
                  value={values.nationality ?? ""}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Việt Nam"
                  className="h-11 rounded-lg pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="h-11 rounded-lg pl-10"
                />
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Xác nhận mật khẩu
              </Label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="h-11 rounded-lg pl-10"
                />
              </div>
            </div>
          </div>

          {/* Tiêu chí mật khẩu */}
          <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4">
            {passwordChecks.map((check) => (
              <div
                key={check.label}
                className="flex items-center gap-1.5 text-[11px]"
              >
                <div
                  className={`size-2 rounded-full ${
                    check.valid
                      ? "bg-emerald-500"
                      : "bg-muted-foreground/30"
                  }`}
                />

                <span
                  className={
                    check.valid
                      ? "font-medium text-emerald-600"
                      : "text-muted-foreground"
                  }
                >
                  {check.label}
                </span>
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2.5 font-semibold transition"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Đang tạo tài khoản...
              </>
            ) : (
              "Đăng ký ngay"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
