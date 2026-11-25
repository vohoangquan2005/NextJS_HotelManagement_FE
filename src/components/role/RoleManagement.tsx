"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { LoaderCircle, Pencil, Plus, RefreshCw, Shield, Trash2, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RoleForm } from "@/components/role/RoleForm";

import {
    createRole,
    deleteRole,
    getDeletedRoles,
    getRoles,
    restoreRole,
    softDeleteRole,
    updateRole,
    type RoleDto,
    type RoleWriteDto,
} from "@/app/api/role.api";

export default function RoleManagement() {
    const [items, setItems] = useState<RoleDto[]>([]);
    const [deleted, setDeleted] = useState(false);
    const [edit, setEdit] = useState<RoleDto | null | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(
        async (inactive = deleted) => {
            setLoading(true);
            setError("");

            try {
                const data = inactive ? await getDeletedRoles() : await getRoles();
                setItems(Array.isArray(data) ? data : []);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Không thể tải vai trò.");
            } finally {
                setLoading(false);
            }
        },
        [deleted],
    );

    useEffect(() => {
        let active = true;

        void (deleted ? getDeletedRoles() : getRoles())
            .then((x) => {
                if (active) setItems(Array.isArray(x) ? x : []);
            })
            .catch((e: unknown) => {
                if (active) {
                    setError(e instanceof Error ? e.message : "Không thể tải vai trò.");
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [deleted]);

    async function save(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (edit === undefined) return;

        const form = new FormData(e.currentTarget);

        const data: RoleWriteDto = {
            roleName: String(form.get("name")).trim(),
            description: String(form.get("description")).trim() || null,
        };

        try {
            if (edit) {
                await updateRole(edit.roleId, data);
            } else {
                await createRole(data);
            }

            setEdit(undefined);
            await load(false);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể lưu vai trò.");
        }
    }

    async function action(item: RoleDto, kind: "restore" | "delete" | "soft") {
        const label =
            kind === "restore" ? "khôi phục" : kind === "delete" ? "xóa vĩnh viễn" : "xóa mềm";

        if (!window.confirm(`Xác nhận ${label} vai trò “${item.roleName ?? item.roleId}”?`)) {
            return;
        }

        try {
            if (kind === "restore") {
                await restoreRole(item.roleId);
            } else if (kind === "delete") {
                await deleteRole(item.roleId);
            } else {
                await softDeleteRole(item.roleId);
            }

            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : `Không thể ${label} vai trò.`);
        }
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Quản trị khách sạn
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        {deleted ? "Vai trò đã xóa" : "Vai trò"}
                    </h1>
                </div>

                <div className="flex gap-2">
                    <Button disabled={deleted} onClick={() => setEdit(null)}>
                        <Plus className="mr-2 size-4" />
                        Thêm vai trò
                    </Button>

                    <Button variant="outline" onClick={() => setDeleted(!deleted)}>
                        {deleted ? "Đang hoạt động" : "Đã xóa"}
                    </Button>

                    <Button variant="outline" onClick={() => void load()} disabled={loading}>
                        <RefreshCw className="size-4" />
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

            {loading ? (
                <div className="flex min-h-40 items-center justify-center gap-2 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải…
                </div>
            ) : !Array.isArray(items) || items.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                    <Shield className="mx-auto mb-3 size-7" />
                    Chưa có vai trò.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3">Tên vai trò</th>
                                <th className="px-4 py-3">Mô tả</th>
                                <th className="px-4 py-3 text-right">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {(Array.isArray(items) ? items : []).map((x) => (
                                <tr key={x.roleId}>
                                    <td className="px-4 py-3 font-medium">{x.roleName}</td>

                                    <td className="px-4 py-3">{x.description || "—"}</td>

                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            {deleted ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => void action(x, "restore")}
                                                    >
                                                        <Undo2 className="mr-1 size-3" />
                                                        Khôi phục
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => void action(x, "delete")}
                                                    >
                                                        Xóa vĩnh viễn
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEdit(x)}
                                                    >
                                                        <Pencil className="mr-1 size-3" />
                                                        Sửa
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => void action(x, "soft")}
                                                    >
                                                        <Trash2 className="mr-1 size-3 text-red-600" />
                                                        Xóa mềm
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {edit !== undefined && (
                <RoleForm role={edit} onSubmit={save} onCancel={() => setEdit(undefined)} />
            )}
        </div>
    );
}
