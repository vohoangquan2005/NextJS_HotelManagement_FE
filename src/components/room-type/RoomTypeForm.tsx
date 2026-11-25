"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RoomTypeDto } from "@/types/room-type";

export function RoomTypeForm({
    roomType,
    onSubmit,
    onCancel,
}: {
    roomType: RoomTypeDto | null;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
            <form
                onSubmit={onSubmit}
                className="max-h-[95vh] w-full max-w-lg space-y-4 overflow-auto rounded-xl border bg-background p-6"
            >
                <h2 className="text-xl font-bold">
                    {roomType ? "Sửa loại phòng" : "Thêm loại phòng"}
                </h2>

                <label className="block text-sm">
                    Tên loại phòng
                    <Input
                        name="name"
                        required
                        maxLength={50}
                        defaultValue={roomType?.roomTypeName ?? ""}
                    />
                </label>

                <div className="grid grid-cols-2 gap-3">
                    <label className="block text-sm">
                        Số giường
                        <Input
                            name="beds"
                            type="number"
                            min="0"
                            required
                            defaultValue={roomType?.bedCount ?? 1}
                        />
                    </label>
                    <label className="block text-sm">
                        Loại giường
                        <Input
                            name="bedType"
                            required
                            maxLength={50}
                            defaultValue={roomType?.bedType ?? ""}
                        />
                    </label>
                </div>

                <label className="block text-sm">
                    Kích thước
                    <Input
                        name="size"
                        required
                        defaultValue={roomType?.size ?? ""}
                        placeholder="Ví dụ: 5m x 6m"
                    />
                </label>

                <label className="block text-sm">
                    Mô tả
                    <textarea
                        name="description"
                        maxLength={500}
                        defaultValue={roomType?.description ?? ""}
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
