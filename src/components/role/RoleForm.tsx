"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RoleDto } from "@/app/api/role.api";

export function RoleForm({
    role,
    onSubmit,
    onCancel,
}: {
    role: RoleDto | null;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-lg space-y-4 rounded-xl border bg-background p-6"
            >
                <h2 className="text-xl font-bold">{role ? "Sửa vai trò" : "Thêm vai trò"}</h2>

                <label className="block text-sm">
                    Tên vai trò
                    <Input
                        name="name"
                        required
                        maxLength={50}
                        defaultValue={role?.roleName ?? ""}
                    />
                </label>

                <label className="block text-sm">
                    Mô tả
                    <textarea
                        name="description"
                        maxLength={255}
                        defaultValue={role?.description ?? ""}
                        className="mt-1 min-h-24 w-full rounded-md border bg-background p-3"
                    />
                </label>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Hủy
                    </Button>
                    <Button type="submit">Lưu</Button>
                </div>
            </form>
        </div>
    );
}
