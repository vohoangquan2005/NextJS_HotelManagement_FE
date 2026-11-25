"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
    LoaderCircle,
    Plus,
    RefreshCw,
    RotateCcw,
    Trash2,
    UserRound,
    UserRoundSearch,
} from "lucide-react";

import {
    createAdminUser,
    deleteAdminUser,
    getAdminUserById,
    getAdminUsers,
    getDeletedAdminUsers,
    restoreAdminUser,
    softDeleteAdminUser,
} from "@/app/api/user-admin.api";
import { getRoles } from "@/app/api/role.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserForm } from "@/components/user/UserForm";
import type { AdminUserDto, UserRoleOption } from "@/types/user-admin";
import ImageWithFallback from "@/components/common/ImageWithFallback";

export default function UserManagement() {
    const [items, setItems] = useState<AdminUserDto[]>([]);
    const [roles, setRoles] = useState<UserRoleOption[]>([]);
    const [deleted, setDeleted] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [detail, setDetail] = useState<AdminUserDto | null>(null);
    const [search, setSearch] = useState("");
    const [roleId, setRoleId] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback(
        async (inactive = deleted) => {
            setLoading(true);
            setError("");

            try {
                const data = inactive ? await getDeletedAdminUsers() : await getAdminUsers();

                setItems(Array.isArray(data) ? data : []);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Không thể tải danh sách tài khoản.");
            } finally {
                setLoading(false);
            }
        },
        [deleted],
    );

    useEffect(() => {
        let active = true;

        void (deleted ? getDeletedAdminUsers() : getAdminUsers())
            .then((data) => {
                if (active) {
                    setItems(Array.isArray(data) ? data : []);
                }
            })
            .catch((e: unknown) => {
                if (active) {
                    setError(e instanceof Error ? e.message : "Không thể tải danh sách tài khoản.");
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [deleted]);

    useEffect(() => {
        let active = true;

        void getRoles()
            .then((data) => {
                if (active) {
                    setRoles(
                        (Array.isArray(data) ? data : []).map((role) => ({
                            roleId: role.roleId,
                            roleName: role.roleName || `Vai trò #${role.roleId}`,
                        })),
                    );
                }
            })
            .catch((e: unknown) => {
                if (active) {
                    setError(e instanceof Error ? e.message : "Không thể tải danh sách vai trò.");
                }
            });

        return () => {
            active = false;
        };
    }, []);

    async function save(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const avatar = data.get("Avatar");
        if (!(avatar instanceof File) || avatar.size === 0) {
            data.delete("Avatar");
        }

        const selectedRoleId = Number(data.get("User.RoleId"));
        const selectedRole = roles.find((role) => role.roleId === selectedRoleId);
        if (
            selectedRole?.roleName.toLowerCase() === "customer" &&
            !/^\d{12}$/.test(String(data.get("Customer.CCCD") ?? "").trim())
        ) {
            setError("CCCD phải gồm đúng 12 chữ số.");
            return;
        }
        if (selectedRole?.roleName.toLowerCase() === "customer") {
            const nationality = String(data.get("Customer.Nationality") ?? "").trim();
            data.set("Customer.Nationality", nationality || "Việt Nam");
        }

        setSaving(true);
        setError("");

        try {
            await createAdminUser(data);
            setCreateOpen(false);
            await load(false);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể tạo tài khoản.");
        } finally {
            setSaving(false);
        }
    }

    async function showDetail(user: AdminUserDto) {
        setError("");

        try {
            const data = await getAdminUserById(user.userId);
            setDetail(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể tải thông tin tài khoản.");
        }
    }

    async function action(user: AdminUserDto, kind: "restore" | "delete" | "soft") {
        const label =
            kind === "restore" ? "khôi phục" : kind === "delete" ? "xóa vĩnh viễn" : "xóa mềm";

        const name = user.fullName || user.email || `#${user.userId}`;

        if (!window.confirm(`Xác nhận ${label} tài khoản "${name}"?`)) {
            return;
        }

        setError("");

        try {
            if (kind === "restore") {
                await restoreAdminUser(user.userId);
            } else if (kind === "delete") {
                await deleteAdminUser(user.userId);
            } else {
                await softDeleteAdminUser(user.userId);
            }

            if (detail?.userId === user.userId) {
                setDetail(null);
            }

            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : `Không thể ${label} tài khoản.`);
        }
    }

    const query = search.trim().toLocaleLowerCase("vi");

    const rows = useMemo(() => {
        return (Array.isArray(items) ? items : []).filter((user) => {
            const matchesSearch = [user.fullName, user.email, user.phoneNumber].some((value) =>
                (value ?? "").toLocaleLowerCase("vi").includes(query),
            );

            const matchesRole = roleId === "" || String(user.roleId) === roleId;

            return matchesSearch && matchesRole;
        });
    }, [items, query, roleId]);

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Quản lý người dùng
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">
                        {deleted ? "Tài khoản đã xóa" : "Tài khoản"}
                    </h1>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        disabled={deleted}
                        onClick={() => {
                            setError("");
                            setCreateOpen(true);
                        }}
                    >
                        <Plus className="mr-2 size-4" />
                        Thêm tài khoản
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => {
                            setDeleted((value) => !value);
                            setSearch("");
                            setRoleId("");
                            setDetail(null);
                            setError("");
                        }}
                    >
                        {deleted ? "Đang hoạt động" : "Đã xóa"}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => void load()}
                        disabled={loading}
                        aria-label="Tải lại danh sách"
                    >
                        <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </header>

            {error && (
                <p
                    role="alert"
                    className="rounded-lg border border-destructive/30 p-3 text-sm text-destructive"
                >
                    {error}
                </p>
            )}

            <div className="flex flex-wrap gap-3">
                <div className="min-w-[220px] flex-1">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm tên, email hoặc số điện thoại..."
                        aria-label="Tìm kiếm tài khoản"
                    />
                </div>

                <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="h-10 min-w-48 rounded-md border bg-background px-3 text-sm"
                    aria-label="Lọc theo vai trò"
                >
                    <option value="">Tất cả vai trò</option>
                    {roles.map((role) => (
                        <option key={role.roleId} value={role.roleId}>
                            {role.roleName}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex min-h-40 items-center justify-center gap-2 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải...
                </div>
            ) : rows.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                    <UserRound className="mx-auto mb-3 size-7" />
                    {items.length === 0
                        ? "Chưa có tài khoản."
                        : "Không tìm thấy tài khoản phù hợp."}
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full min-w-[850px] text-left text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                {[
                                    "Họ và tên",
                                    "Email",
                                    "Số điện thoại",
                                    "Vai trò",
                                    "Trạng thái",
                                    
                                ].map((heading) => (
                                    <th key={heading} className="px-4 py-3">
                                        {heading}
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-right">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {rows.map((user) => (
                                <tr key={user.userId}>
                                    <td className="px-4 py-3 font-medium">
                                        {user.fullName || "—"}
                                    </td>
                                    <td className="px-4 py-3">{user.email || "—"}</td>
                                    <td className="px-4 py-3">{user.phoneNumber || "—"}</td>
                                    <td className="px-4 py-3">
                                        {user.roleName || `Vai trò #${user.roleId}`}
                                    </td>
                                    <td className="px-4 py-3">
                                        {deleted
                                            ? "Đã xóa"
                                            : user.isLocked
                                              ? "Đã khóa"
                                              : "Hoạt động"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => void showDetail(user)}
                                            >
                                                <UserRoundSearch className="mr-1 size-3" />
                                                Chi tiết
                                            </Button>

                                            {deleted ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => void action(user, "restore")}
                                                    >
                                                        <RotateCcw className="mr-1 size-3" />
                                                        Khôi phục
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => void action(user, "delete")}
                                                    >
                                                        <Trash2 className="mr-1 size-3" />
                                                        Xóa vĩnh viễn
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => void action(user, "soft")}
                                                >
                                                    <Trash2 className="mr-1 size-3 text-red-600" />
                                                    Xóa mềm
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {createOpen && (
                <UserForm
                    roles={roles}
                    onSubmit={save}
                    onCancel={() => setCreateOpen(false)}
                    saving={saving}
                    error={error}
                />
            )}

            {detail && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
                    <div className="max-h-[95vh] w-full max-w-lg space-y-4 overflow-auto rounded-xl border bg-background p-6">
                        <h2 className="text-xl font-bold">Chi tiết tài khoản</h2>

                        <div className="space-y-3 text-sm">
                            <DetailRow label="Mã tài khoản" value={String(detail.userId)} />
                            <DetailRow label="Họ và tên" value={detail.fullName} />
                            <DetailRow label="Email" value={detail.email} />
                            <DetailRow label="Vai trò" value={detail.roleName} />
                            <DetailRow label="Số điện thoại" value={detail.phoneNumber} />
                            <DetailRow
                                label="Giới tính"
                                value={detail.gender == null ? null : String(detail.gender)}
                            />
                            <DetailRow
                                label="Ngày sinh"
                                value={detail.dateOfBirth ? detail.dateOfBirth.slice(0, 10) : null}
                            />
                            <DetailRow
                                label="Trạng thái"
                                value={
                                    detail.isDeleted
                                        ? "Đã xóa"
                                        : detail.isLocked
                                          ? "Đã khóa"
                                          : "Hoạt động"
                                }
                            />
                            <div className="grid grid-cols-[140px_1fr] gap-3 border-b pb-2">
                                <span className="text-muted-foreground">Ảnh đại diện</span>
                                <div className="size-20 overflow-hidden rounded-full border bg-muted">
                                    <ImageWithFallback
                                        src={detail.avatar}
                                        alt={`Ảnh đại diện ${detail.fullName || "tài khoản"}`}
                                        className="size-full object-cover"
                                        fallback={<div className="flex size-full items-center justify-center"><UserRound className="size-8 text-muted-foreground" /></div>}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button variant="outline" onClick={() => setDetail(null)}>
                                Đóng
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="grid grid-cols-[140px_1fr] gap-3 border-b pb-2">
            <span className="text-muted-foreground">{label}</span>
            <span className="break-words font-medium">{value || "—"}</span>
        </div>
    );
}
