"use client";

import type { FormEvent } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RoomResponseDto } from "@/types/room";

export function RoomImageForm({
    rooms,
    roomId,
    setRoomId,
    setFile,
    primary,
    setPrimary,
    order,
    setOrder,
    saving,
    loading,
    onSubmit,
}: {
    rooms: RoomResponseDto[];
    roomId: string;
    setRoomId: (value: string) => void;
    setFile: (value: File | null) => void;
    primary: boolean;
    setPrimary: (value: boolean) => void;
    order: string;
    setOrder: (value: string) => void;
    saving: boolean;
    loading: boolean;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
    return (
        <form
            onSubmit={onSubmit}
            className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2"
        >
            <h2 className="sm:col-span-2 font-semibold">Thêm ảnh phòng</h2>
            <label className="space-y-1 text-sm">
                Phòng
                <select
                    required
                    className="h-10 w-full rounded-md border bg-background px-3"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                >
                    <option value="">Chọn phòng</option>
                    {rooms.map((r) => (
                        <option key={r.roomId} value={r.roomId}>
                            {r.roomName || `Phòng #${r.roomId}`}
                        </option>
                    ))}
                </select>
            </label>
            <label className="space-y-1 text-sm">
                Tệp ảnh
                <Input
                    required
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
            </label>
            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={primary}
                    onChange={(e) => setPrimary(e.target.checked)}
                />
                Ảnh chính
            </label>
            <label className="space-y-1 text-sm">
                Thứ tự hiển thị
                <Input
                    type="number"
                    min="0"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                />
            </label>
            <div className="sm:col-span-2">
                <Button type="submit" disabled={saving || loading}>
                    <Plus className="mr-2 size-4" />
                    {saving ? "Đang tải…" : "Tải ảnh lên"}
                </Button>
            </div>
        </form>
    );
}
