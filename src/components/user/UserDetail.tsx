"use client";

import type { AdminUserDto } from "@/types/user-admin";

export function UserDetail({ user, onClose }: { user: AdminUserDto | null; onClose: () => void }) {
    if (!user) {
        return null;
    }

    return (
        <section className="rounded-xl border bg-card p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Chi tiết tài khoản #{user.userId}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">{user.fullName || user.email}</h2>
                </div>
                <button type="button" className="text-sm text-muted-foreground" onClick={onClose}>
                    Đóng
                </button>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>Email: {user.email || "—"}</div>
                <div>Vai trò: {user.roleName || "—"}</div>
                <div>Điện thoại: {user.phoneNumber || "—"}</div>
                <div>Giới tính: {String(user.gender ?? "—")}</div>
                <div>
                    Ngày sinh:{" "}
                    {user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                        : "—"}
                </div>
                <div>Trạng thái khóa: {Number(user.isLocked) === 1 ? "Đã khóa" : "Hoạt động"}</div>
            </dl>
        </section>
    );
}
