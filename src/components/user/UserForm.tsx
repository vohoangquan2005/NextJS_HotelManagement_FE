"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ImagePlus, LoaderCircle, Trash2, UserRound, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserRoleOption } from "@/types/user-admin";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const maxFileSize = 5 * 1024 * 1024;

export function UserForm({
    roles,
    onSubmit,
    onCancel,
    saving,
    error,
}: {
    roles: UserRoleOption[];
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
    saving: boolean;
    error: string;
}) {
    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarError, setAvatarError] = useState("");
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const avatarPreviewRef = useRef<string | null>(null);

    const customerRole = roles.find((role) => role.roleName.toLowerCase() === "customer");
    const selectedRole = roles.find((role) => String(role.roleId) === selectedRoleId);
    const isCustomer = selectedRole?.roleName.toLowerCase() === "customer";

    useEffect(
        () => () => {
            if (avatarPreviewRef.current) {
                URL.revokeObjectURL(avatarPreviewRef.current);
            }
        },
        [],
    );

    function clearAvatarPreview() {
        if (avatarPreviewRef.current) {
            URL.revokeObjectURL(avatarPreviewRef.current);
            avatarPreviewRef.current = null;
        }
        setAvatarPreview(null);
    }

    function chooseAvatar(file: File | null) {
        setAvatarError("");
        if (!file) {
            setAvatarFile(null);
            clearAvatarPreview();
            return;
        }

        const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
        if (!allowedTypes.has(file.type) || !allowedExtensions.has(extension)) {
            setAvatarFile(null);
            clearAvatarPreview();
            setAvatarError("Chỉ chấp nhận ảnh JPG, JPEG, PNG hoặc WEBP.");
            if (avatarInputRef.current) {
                avatarInputRef.current.value = "";
            }
            return;
        }

        if (file.size === 0 || file.size > maxFileSize) {
            setAvatarFile(null);
            clearAvatarPreview();
            setAvatarError("Ảnh phải có dung lượng lớn hơn 0 và không vượt quá 5 MB.");
            if (avatarInputRef.current) {
                avatarInputRef.current.value = "";
            }
            return;
        }

        setAvatarFile(file);
        clearAvatarPreview();
        const previewUrl = URL.createObjectURL(file);
        avatarPreviewRef.current = previewUrl;
        setAvatarPreview(previewUrl);
    }

    function removeAvatar() {
        setAvatarFile(null);
        setAvatarError("");
        clearAvatarPreview();
        if (avatarInputRef.current) {
            avatarInputRef.current.value = "";
        }
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (avatarError || saving) {
            return;
        }

        onSubmit(event);
    }

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
            <form
                onSubmit={submit}
                encType="multipart/form-data"
                className="max-h-[95vh] w-full max-w-2xl space-y-4 overflow-auto rounded-xl border bg-background p-6"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold">Thêm tài khoản người dùng</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Có thể bỏ qua ảnh đại diện.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Đóng biểu mẫu"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        <X className="size-4" />
                    </Button>
                </div>

                {error && (
                    <p
                        role="alert"
                        className="rounded-lg border border-destructive/30 p-3 text-sm text-destructive"
                    >
                        {error}
                    </p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm">
                        Họ và tên
                        <Input
                            name="User.FullName"
                            required
                            maxLength={50}
                            placeholder="Nhập họ và tên"
                            disabled={saving}
                        />
                    </label>

                    <label className="block text-sm">
                        Email
                        <Input
                            name="User.Email"
                            type="email"
                            required
                            maxLength={50}
                            placeholder="example@email.com"
                            disabled={saving}
                        />
                    </label>

                    <label className="block text-sm">
                        Mật khẩu
                        <Input
                            name="User.HashPassword"
                            type="password"
                            required
                            autoComplete="new-password"
                            placeholder="Nhập mật khẩu"
                            disabled={saving}
                        />
                    </label>

                    <label className="block text-sm">
                        Vai trò
                        <select
                            name="User.RoleId"
                            required
                            value={selectedRoleId}
                            onChange={(event) => setSelectedRoleId(event.target.value)}
                            disabled={saving}
                            className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
                        >
                            <option value="" disabled>
                                Chọn vai trò
                            </option>
                            {roles.map((role) => (
                                <option key={role.roleId} value={role.roleId}>
                                    {role.roleName}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block text-sm">
                        Giới tính
                        <select
                            name="User.Gender"
                            defaultValue=""
                            disabled={saving}
                            className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
                        >
                            <option value="">Chưa cung cấp</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </label>

                    <label className="block text-sm">
                        Ngày sinh
                        <Input
                            name="User.DateOfBirth"
                            type="date"
                            max={new Date().toLocaleDateString("en-CA")}
                            disabled={saving}
                        />
                    </label>

                    <label className="block text-sm">
                        Số điện thoại
                        <Input
                            name="User.PhoneNumber"
                            type="tel"
                            required
                            placeholder="Nhập số điện thoại"
                            disabled={saving}
                        />
                    </label>
                </div>

                <section className="space-y-3 rounded-lg border p-4">
                    <div>
                        <h3 className="text-sm font-semibold">Ảnh đại diện</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                            JPG, JPEG, PNG hoặc WEBP; tối đa 5 MB.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border bg-muted">
                            {avatarPreview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={avatarPreview}
                                    alt="Xem trước ảnh đại diện"
                                    className="size-full object-cover"
                                />
                            ) : (
                                <UserRound className="size-10 text-muted-foreground" />
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm hover:bg-muted">
                                <ImagePlus className="size-4" />
                                {avatarFile ? "Chọn ảnh khác" : "Chọn ảnh"}
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    name="Avatar"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="sr-only"
                                    disabled={saving}
                                    onChange={(event) =>
                                        chooseAvatar(event.target.files?.[0] ?? null)
                                    }
                                />
                            </label>

                            {avatarFile && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={removeAvatar}
                                    disabled={saving}
                                >
                                    <Trash2 className="mr-2 size-4" />
                                    Bỏ ảnh
                                </Button>
                            )}
                        </div>
                    </div>

                    {avatarFile && (
                        <p className="text-xs text-muted-foreground">
                            {avatarFile.name} · {(avatarFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    )}

                    {avatarError && (
                        <p role="alert" className="text-sm text-destructive">
                            {avatarError}
                        </p>
                    )}
                </section>

                {isCustomer && (
                    <fieldset className="space-y-4 rounded-lg border p-4">
                        <legend className="px-2 text-sm font-semibold">Thông tin khách hàng</legend>

                        <p className="text-xs text-muted-foreground">
                            Bắt buộc khi chọn vai trò {customerRole?.roleName}.
                        </p>

                        <label className="block text-sm">
                            CCCD
                            <Input
                                name="Customer.CCCD"
                                required
                                minLength={12}
                                maxLength={12}
                                pattern="[0-9]{12}"
                                title="CCCD phải gồm đúng 12 chữ số"
                                placeholder="Nhập CCCD gồm 12 chữ số"
                                disabled={saving}
                            />
                        </label>

                        <label className="block text-sm">
                            Quốc tịch
                            <Input
                                name="Customer.Nationality"
                                maxLength={50}
                                defaultValue="Việt Nam"
                                disabled={saving}
                            />
                        </label>
                    </fieldset>
                )}

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
                        Hủy
                    </Button>

                    <Button type="submit" disabled={saving || roles.length === 0}>
                        {saving ? (
                            <>
                                <LoaderCircle className="mr-2 size-4 animate-spin" />
                                Đang tải lên và lưu…
                            </>
                        ) : (
                            "Thêm tài khoản"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
