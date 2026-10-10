"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    UserRound,
    Mail,
    Phone,
    ShieldCheck,
    IdCard,
    Globe,
    CalendarDays,
    ArrowLeft,
    LockKeyhole,
    Loader2,
    Hotel,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile } from "@/app/api/auth.api";
import type { UserProfileResponse } from "@/types/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.replace("/login?redirect=%2Fprofile");
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function loadProfile() {
            setLoading(true);
            setError("");

            try {
                const response = await getProfile();

                if (!cancelled) {
                    setProfile(response);
                }
            } catch (err: unknown) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Không thể tải thông tin hồ sơ."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadProfile();

        return () => {
            cancelled = true;
        };
    }, [user, authLoading, router]);

    const formatDate = (value?: string | null) => {
        if (!value) return "Chưa cập nhật";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("vi-VN");
    };

    const InfoItem = ({
        icon: Icon,
        label,
        value,
    }: {
        icon: React.ElementType;
        label: string;
        value?: string | number | null;
    }) => (
        <div className="flex items-start gap-3 rounded-xl border bg-background p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                </p>
                <p className="mt-1 break-words text-sm font-medium text-foreground">
                    {value || "Chưa cập nhật"}
                </p>
            </div>
        </div>
    );

    if (authLoading || loading) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Loader2 className="size-5 animate-spin text-primary" />
                    Đang tải hồ sơ...
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full px-4 py-10">
            <div className="mx-auto w-full max-w-4xl">
                <Link
                    href="/"
                    className="mb-5 inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft className="size-3.5" />
                    Về trang chủ
                </Link>

                <div className="overflow-hidden rounded-2xl border bg-card shadow-xl">
                    {/* Header */}
                    <div className="border-b bg-primary/5 px-6 py-8 sm:px-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-background text-primary">
                                {profile?.avatar ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={profile.avatar}
                                        alt="Ảnh đại diện"
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <UserRound className="size-10" />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="mb-2 flex items-center gap-2">
                                    <Hotel className="size-4 text-primary" />
                                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                                        Âm Phủ Hotel
                                    </span>
                                </div>

                                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    Hồ sơ cá nhân
                                </h1>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Quản lý thông tin tài khoản của bạn
                                </p>
                            </div>

                            {profile?.roleName && (
                                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-semibold text-primary">
                                    <ShieldCheck className="size-3.5" />
                                    {profile.roleName}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Profile content */}
                    <div className="p-6 sm:p-8">
                        {error ? (
                            <div
                                role="alert"
                                className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-4 text-sm text-destructive"
                            >
                                <p>{error}</p>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => window.location.reload()}
                                >
                                    Thử tải lại
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-5">
                                    <h2 className="text-base font-bold text-foreground">
                                        Thông tin tài khoản
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Thông tin được lấy từ hệ thống.
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <InfoItem
                                        icon={UserRound}
                                        label="Họ và tên"
                                        value={profile?.fullName ?? user.fullName}
                                    />

                                    <InfoItem
                                        icon={Mail}
                                        label="Email"
                                        value={profile?.email ?? user.email}
                                    />

                                    <InfoItem
                                        icon={Phone}
                                        label="Số điện thoại"
                                        value={profile?.phoneNumber ?? user.phoneNumber}
                                    />

                                    <InfoItem
                                        icon={ShieldCheck}
                                        label="Vai trò"
                                        value={profile?.roleName ?? user.roleName}
                                    />

                                    <InfoItem
                                        icon={IdCard}
                                        label="CCCD / CMND"
                                        value={profile?.cccd}
                                    />

                                    <InfoItem
                                        icon={Globe}
                                        label="Quốc tịch"
                                        value={profile?.nationality}
                                    />

                                    <InfoItem
                                        icon={CalendarDays}
                                        label="Ngày sinh"
                                        value={formatDate(profile?.dateOfBirth)}
                                    />
                                </div>

                                <div className="mt-8 border-t pt-6">
                                    <h2 className="text-base font-bold text-foreground">
                                        Bảo mật tài khoản
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Bảo vệ tài khoản bằng cách cập nhật mật khẩu định kỳ.
                                    </p>

                                    <div className="mt-4 flex flex-col gap-3 rounded-xl border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <LockKeyhole className="size-5" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-foreground">
                                                    Mật khẩu
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Thay đổi mật khẩu để bảo vệ tài khoản
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href="/changepassword"
                                            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            Đổi mật khẩu
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <p className="mt-5 text-center text-xs text-muted-foreground">
                    Thông tin cá nhân của bạn được quản lý theo tài khoản đăng nhập.
                </p>
            </div>
        </div>
    );
}