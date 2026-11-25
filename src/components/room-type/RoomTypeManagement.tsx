"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { BedDouble, LoaderCircle, Pencil, Plus, RefreshCw, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomTypeForm } from "@/components/room-type/RoomTypeForm";
import {
    createRoomType,
    deleteRoomType,
    getDeletedRoomTypes,
    getRoomTypes,
    restoreRoomType,
    softDeleteRoomType,
    updateRoomType,
} from "@/app/api/room-type.api";
import type { RoomTypeDto, RoomTypeWriteDto } from "@/types/room-type";

export default function RoomTypeManagement() {
    const [items, setItems] = useState<RoomTypeDto[]>([]);
    const [deleted, setDeleted] = useState(false);
    const [edit, setEdit] = useState<RoomTypeDto | null | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(
        async (inactive = deleted) => {
            setLoading(true);
            setError("");
            try {
                const data = inactive ? await getDeletedRoomTypes() : await getRoomTypes();
                setItems(Array.isArray(data) ? data : []);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Không thể tải loại phòng.");
            } finally {
                setLoading(false);
            }
        },
        [deleted],
    );

    useEffect(() => {
        let active = true;
        void (deleted ? getDeletedRoomTypes() : getRoomTypes())
            .then((x) => {
                if (active) setItems(Array.isArray(x) ? x : []);
            })
            .catch((e: unknown) => {
                if (active) setError(e instanceof Error ? e.message : "Không thể tải loại phòng.");
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
        const f = new FormData(e.currentTarget);
        const body: RoomTypeWriteDto = {
            roomTypeName: String(f.get("name")).trim(),
            bedCount: Number(f.get("beds")),
            bedType: String(f.get("bedType")).trim(),
            size: String(f.get("size")).trim(),
            description: String(f.get("description")).trim() || null,
        };
        try {
            if (edit) await updateRoomType(edit.roomTypeId, body);
            else await createRoomType(body);
            setEdit(undefined);
            await load(false);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể lưu loại phòng.");
        }
    }

    async function action(item: RoomTypeDto, kind: "restore" | "delete" | "soft") {
        const label =
            kind === "restore" ? "khôi phục" : kind === "delete" ? "xóa vĩnh viễn" : "xóa mềm";
        if (
            !window.confirm(
                `Xác nhận ${label} loại phòng “${item.roomTypeName ?? item.roomTypeId}”?`,
            )
        )
            return;
        try {
            if (kind === "restore") await restoreRoomType(item.roomTypeId);
            else if (kind === "delete") await deleteRoomType(item.roomTypeId);
            else await softDeleteRoomType(item.roomTypeId);
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : `Không thể ${label} loại phòng.`);
        }
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Danh mục loại phòng
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">
                        {deleted ? "Loại phòng đã xóa" : "Loại phòng"}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button disabled={deleted} onClick={() => setEdit(null)}>
                        <Plus className="mr-2 size-4" />
                        Thêm loại phòng
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setDeleted(!deleted);
                            setError("");
                        }}
                    >
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
                    <BedDouble className="mx-auto mb-3 size-7" />
                    Chưa có loại phòng.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full min-w-[650px] text-left text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                {[
                                    "Tên loại phòng",
                                    "Giường",
                                    "Kích thước",
                                    "Mô tả",
                                ].map((x) => (
                                    <th key={x} className="px-4 py-3">
                                        {x}
                                    </th>
                                ))}
                                <th className="px-4 px-3 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {(Array.isArray(items) ? items : []).map((x) => (
                                <tr key={x.roomTypeId}>
                                    <td className="px-4 py-3 font-medium">{x.roomTypeName}</td>
                                    <td className="px-4 py-3">
                                        {x.bedCount} × {x.bedType}
                                    </td>
                                    <td className="px-4 py-3">{x.size}</td>
                                    <td className="max-w-xs px-4 py-3">{x.description || "—"}</td>
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
                                                        className="ml-1 text-destructive text-red-600"
                                                        variant="outline"
                                                        onClick={() => void action(x, "soft")}
                                                    >
                                                        <Trash2 className="mr-1 size-3" />
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
                <RoomTypeForm roomType={edit} onSubmit={save} onCancel={() => setEdit(undefined)} />
            )}
        </div>
    );
}
