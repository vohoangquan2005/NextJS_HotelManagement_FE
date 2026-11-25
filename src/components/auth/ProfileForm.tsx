"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
    UserRound,
    Mail,
    Phone,
    ShieldCheck,
    Globe,
    CalendarDays,
    ArrowLeft,
    LockKeyhole,
    Loader2,
    Hotel,
    Pencil,
    Save,
    X,
    ImagePlus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, updateProfile } from "@/app/api/auth.api";
import type { UserProfileResponse } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import ImageWithFallback from "@/components/common/ImageWithFallback";

function InfoItem({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value?: string | number | null;
}) {
    return (
        <div className="flex items-start gap-3 rounded-xl border bg-background p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="mt-1 break-words text-sm font-medium text-foreground">{value || "Chưa cập nhật"}</p>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const { user, isLoading: authLoading, refreshProfile } = useAuth();

    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [saveMessage, setSaveMessage] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [fields, setFields] = useState({ fullName: "", email: "", phoneNumber: "", dateOfBirth: "" });

    useEffect(() => () => {
        if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    }, [avatarPreview]);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.replace("/login?redirect=%2Fprofile");
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

    function startEditing() {
        setFields({
            fullName: profile?.fullName ?? user?.fullName ?? "",
            email: profile?.email ?? user?.email ?? "",
            phoneNumber: profile?.phoneNumber ?? user?.phoneNumber ?? "",
            dateOfBirth: profile?.dateOfBirth?.slice(0, 10) ?? "",
        });
        setAvatarFile(null);
        setAvatarPreview(null);
        setSaveError("");
        setSaveMessage("");
        setEditing(true);
    }

    async function saveProfile(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setSaveError("");
        setSaveMessage("");

        const data = new FormData();
        data.append("FullName", fields.fullName.trim());
        data.append("Email", fields.email.trim());
        data.append("PhoneNumber", fields.phoneNumber.trim());
        // Only send DateOfBirth when the user has actually selected a date.
        // Sending an empty string causes ASP.NET Core to return a 400 because
        // it cannot bind "" to DateTime?.
        if (fields.dateOfBirth) data.append("DateOfBirth", fields.dateOfBirth);
        if (avatarFile) data.append("Avatar", avatarFile);

        try {
            const updated = await updateProfile(data);
            setProfile(updated);
            // The profile endpoint has already saved and returned the new
            // values. A failed follow-up refresh should not make the form look
            // like the save itself failed.
            await refreshProfile().catch(() => undefined);
            setEditing(false);
            setAvatarFile(null);
            setAvatarPreview(null);
            setSaveMessage("Đã cập nhật hồ sơ cá nhân.");
        } catch (cause) {
            setSaveError(cause instanceof Error ? cause.message : "Không thể cập nhật hồ sơ.");
        } finally {
            setSaving(false);
        }
    }

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
                                <ImageWithFallback
                                    src={profile?.avatar}
                                    alt="Ảnh đại diện"
                                    className="size-full object-cover"
                                    fallback={<UserRound className="size-10" />}
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="mb-2 flex items-center gap-2">
                                    <Hotel className="size-4 text-primary" />
                                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                                        HellStay
                                    </span>
                                </div>

                                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    Hồ sơ cá nhân
                                </h1>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Thông tin hồ sơ hiện có trong tài khoản
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
                                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-base font-bold text-foreground">Thông tin tài khoản</h2>
                                        <p className="mt-1 text-sm text-muted-foreground">Cập nhật thông tin liên hệ và ảnh đại diện.</p>
                                    </div>
                                    {!editing && (
                                        <Button type="button" variant="outline" onClick={startEditing}>
                                            <Pencil className="mr-2 size-4" /> Chỉnh sửa hồ sơ
                                        </Button>
                                    )}
                                </div>

                                {editing ? (
                                    <form className="space-y-5" onSubmit={saveProfile}>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <label className="space-y-2 text-sm font-medium">Họ và tên
                                                <Input required maxLength={50} value={fields.fullName} onChange={(event) => setFields((current) => ({ ...current, fullName: event.target.value }))} />
                                            </label>
                                            <label className="space-y-2 text-sm font-medium">Email
                                                <Input required type="email" maxLength={100} value={fields.email} onChange={(event) => setFields((current) => ({ ...current, email: event.target.value }))} />
                                            </label>
                                            <label className="space-y-2 text-sm font-medium">Số điện thoại
                                                <Input required type="tel" pattern="0[0-9]{9}" title="Số điện thoại gồm 10 chữ số và bắt đầu bằng 0" value={fields.phoneNumber} onChange={(event) => setFields((current) => ({ ...current, phoneNumber: event.target.value }))} />
                                            </label>
                                            <label className="space-y-2 text-sm font-medium">Ngày sinh
                                                <Input type="date" max={new Date().toLocaleDateString("en-CA")} value={fields.dateOfBirth} onChange={(event) => setFields((current) => ({ ...current, dateOfBirth: event.target.value }))} />
                                            </label>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 rounded-xl border p-4">
                                            <div className="size-20 overflow-hidden rounded-full border bg-muted">
                                                <ImageWithFallback src={avatarPreview ?? profile?.avatar} alt="Ảnh đại diện xem trước" className="size-full object-cover" fallback={<UserRound className="m-auto mt-5 size-10 text-muted-foreground" />} />
                                            </div>
                                            <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm hover:bg-muted">
                                                <ImagePlus className="size-4" /> Chọn ảnh đại diện
                                                <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" disabled={saving} onChange={(event) => {
                                                    const file = event.target.files?.[0] ?? null;
                                                    setAvatarFile(file);
                                                    setAvatarPreview(file ? URL.createObjectURL(file) : null);
                                                }} />
                                            </label>
                                            <p className="text-xs text-muted-foreground">JPG, PNG hoặc WEBP; tối đa 5 MB.</p>
                                        </div>
                                        {saveError && <p role="alert" className="text-sm text-destructive">{saveError}</p>}
                                        <div className="flex justify-end gap-2">
                                            <Button type="button" variant="outline" disabled={saving} onClick={() => { setEditing(false); setAvatarFile(null); setSaveError(""); }}><X className="mr-2 size-4" />Hủy</Button>
                                            <Button type="submit" disabled={saving}><Save className="mr-2 size-4" />{saving ? "Đang lưu…" : "Lưu thay đổi"}</Button>
                                        </div>
                                    </form>
                                ) : (
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
                                )}
                                {saveMessage && !editing && <p role="status" className="mt-3 text-sm text-emerald-700">{saveMessage}</p>}

                                <div className="mt-8 border-t pt-6">
                                    <h2 className="text-base font-bold text-foreground">
                                        Bảo mật tài khoản
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">Đổi mật khẩu tài khoản hiện tại.</p>

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
                                                    Cần xác nhận mật khẩu hiện tại để đổi.
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
