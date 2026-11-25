"use client";

import { LoaderCircle, Trash2, Undo2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AdminUserDto } from "@/types/user-admin";

export function UserList({
    users,
    deleted,
    loading,
    onShowDetail,
    onToggle,
    onHardDelete,
}: {
    users: AdminUserDto[];
    deleted: boolean;
    loading: boolean;
    onShowDetail: (user: AdminUserDto) => void;
    onToggle: (user: AdminUserDto) => void;
    onHardDelete: (user: AdminUserDto) => void;
}) {
    return (
        <>
            {loading ? (
                <div className="flex min-h-40 items-center justify-center gap-2 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải…
                </div>
            ) : users.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                    <Users className="mx-auto mb-3 size-7" />
                    Không có tài khoản phù hợp.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full min-w-[700px] text-left text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                {[
                                    "Người dùng",
                                    "Vai trò",
                                    "Điện thoại",
                                    "Tình trạng",
                                    "Thao tác",
                                ].map((label) => (
                                    <th key={label} className="px-4 py-3">
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user.userId}>
                                    <td className="px-4 py-3">
                                        <button
                                            type="button"
                                            className="text-left font-medium text-primary underline-offset-4 hover:underline"
                                            onClick={() => onShowDetail(user)}
                                        >
                                            {user.fullName || "—"}
                                        </button>
                                        <p className="text-xs text-muted-foreground">
                                            {user.email || "—"}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">{user.roleName || "—"}</td>
                                    <td className="px-4 py-3">{user.phoneNumber || "—"}</td>
                                    <td className="px-4 py-3">
                                        {Number(user.isLocked) === 1 ? "Đã khóa" : "Hoạt động"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {deleted && (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => onHardDelete(user)}
                                            >
                                                <Trash2 className="mr-1 size-3" />
                                                Xóa hẳn
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onToggle(user)}
                                        >
                                            {deleted ? (
                                                <>
                                                    <Undo2 className="mr-1 size-3" />
                                                    Khôi phục
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="mr-1 size-3" />
                                                    Xóa mềm
                                                </>
                                            )}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
