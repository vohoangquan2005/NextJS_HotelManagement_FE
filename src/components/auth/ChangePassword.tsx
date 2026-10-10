"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import {
    ArrowLeft,
    Eye,
    EyeOff,
    KeyRound,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormFields } from "@/hooks/useFormFields";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { ChangePasswordDto } from "@/types/auth";

const initialValues: ChangePasswordDto = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
};

type PasswordField =
    | "currentPassword"
    | "newPassword"
    | "confirmNewPassword";

export default function ChangePasswordPage() {
    const router = useRouter();

    const { values, handleChange } =
        useFormFields<ChangePasswordDto>(initialValues);

    const [validationError, setValidationError] = useState("");

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const {
        loading,
        error,
        handleSubmit,
    } = useFormSubmit<ChangePasswordDto, { message: string }>(
        async (data) => {
            // TODO: Thay bằng hàm gọi API đổi mật khẩu thực tế.
            console.log("Change password payload:", data);

            return { message: "Dữ liệu đã được kiểm tra." };
        }
    );

    const validateForm = (): string => {
        if (
            !values.currentPassword.trim() ||
            !values.newPassword ||
            !values.confirmNewPassword
        ) {
            return "Vui lòng nhập đầy đủ thông tin.";
        }

        if (values.newPassword.length < 6) {
            return "Mật khẩu mới phải có ít nhất 6 ký tự.";
        }

        if (values.currentPassword === values.newPassword) {
            return "Mật khẩu mới phải khác mật khẩu hiện tại.";
        }

        if (values.newPassword !== values.confirmNewPassword) {
            return "Mật khẩu xác nhận không khớp.";
        }

        return "";
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (loading) return;

        setValidationError("");

        const message = validateForm();

        if (message) {
            setValidationError(message);
            return;
        }

        await handleSubmit(values);
    };

    const togglePassword = (
        field: keyof typeof showPassword
    ) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const renderPasswordField = (
        field: PasswordField,
        label: string,
        placeholder: string,
        visibilityKey: keyof typeof showPassword,
        autoComplete: string
    ) => (
        <div className="space-y-2">
            <label
                htmlFor={field}
                className="text-sm font-medium leading-none"
            >
                {label}
            </label>

            <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    id={field}
                    name={field}
                    type={showPassword[visibilityKey] ? "text" : "password"}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    value={values[field]}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-11 rounded-lg pl-10 pr-11"
                />

                <button
                    type="button"
                    aria-label={
                        showPassword[visibilityKey]
                            ? "Ẩn mật khẩu"
                            : "Hiện mật khẩu"
                    }
                    onClick={() => togglePassword(visibilityKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                    {showPassword[visibilityKey] ? (
                        <EyeOff className="size-4" />
                    ) : (
                        <Eye className="size-4" />
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-muted/30 px-4 py-10">
            <div className="w-full max-w-lg">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-5 gap-2"
                >
                    <ArrowLeft className="size-4" />
                    Quay lại
                </Button>

                <div className="overflow-hidden rounded-2xl border bg-card shadow-xl">
                    <div className="bg-primary px-6 py-8 text-primary-foreground sm:px-8">
                        <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-white/15">
                            <KeyRound className="size-7" />
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight">
                            Đổi mật khẩu
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
                            Cập nhật mật khẩu để bảo vệ tài khoản của bạn.
                        </p>
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="mb-6 flex gap-3 rounded-xl border bg-muted/40 p-4">
                            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />

                            <div>
                                <p className="text-sm font-semibold">
                                    Bảo mật tài khoản
                                </p>

                                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                    Hãy sử dụng mật khẩu mới đủ mạnh và không chia sẻ
                                    mật khẩu với người khác.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-5">
                            {renderPasswordField(
                                "currentPassword",
                                "Mật khẩu hiện tại",
                                "Nhập mật khẩu hiện tại",
                                "current",
                                "current-password"
                            )}

                            {renderPasswordField(
                                "newPassword",
                                "Mật khẩu mới",
                                "Nhập mật khẩu mới",
                                "new",
                                "new-password"
                            )}

                            {renderPasswordField(
                                "confirmNewPassword",
                                "Xác nhận mật khẩu mới",
                                "Nhập lại mật khẩu mới",
                                "confirm",
                                "new-password"
                            )}

                            {(validationError || error) && (
                                <div
                                    role="alert"
                                    className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                                >
                                    {validationError || error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-11 w-full rounded-lg font-semibold"
                            >
                                <KeyRound className="mr-2 size-4" />
                                {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                disabled={loading}
                                className="h-11 w-full rounded-lg"
                                onClick={() => router.back()}
                            >
                                Hủy
                            </Button>
                        </form>

                        <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
                            Chức năng dùng chung cho Customer, Staff và Admin.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}