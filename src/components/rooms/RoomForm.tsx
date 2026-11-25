"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { RoomResponseDto, RoomTypeOption } from "@/types/room";

const roomStatuses = ["Sẵn sàng", "Đang sử dụng", "Đang dọn dẹp", "Đang bảo trì"];

export type EditorValues = {
    roomName: string;
    roomTypeId: number;
    capacity: number;
    location: string;
    pricePerNight: number;
    description: string;
    status: number;
};

export function RoomEditor({
    room,
    roomTypes,
    onClose,
    onSave,
}: {
    room: RoomResponseDto | null;
    roomTypes: RoomTypeOption[];
    onClose: () => void;
    onSave: (values: EditorValues) => Promise<void>;
}) {
    const [values, setValues] = useState<EditorValues>({
        roomName: room?.roomName ?? "",
        roomTypeId: room?.roomTypeId ?? roomTypes[0]?.roomTypeId ?? 0,
        capacity: room?.capacity ?? 1,
        location: room?.location ?? "",
        pricePerNight: room?.pricePerNight ?? 0,
        description: room?.description ?? "",
        status: Number(room?.status ?? 0),
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSaving(true);

        try {
            await onSave(values);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Không thể lưu phòng.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !saving) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="room-editor-title"
                className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border bg-background p-5 shadow-xl sm:rounded-2xl sm:p-7"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <h2 id="room-editor-title" className="text-xl font-bold">
                            {room ? "Chỉnh sửa phòng" : "Thêm phòng"}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Đóng"
                        className="rounded-md p-2 hover:bg-muted"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <label className="block space-y-1.5 text-sm font-medium">
                        Tên phòng
                        <Input
                            required
                            maxLength={50}
                            value={values.roomName}
                            onChange={(event) =>
                                setValues({
                                    ...values,
                                    roomName: event.target.value,
                                })
                            }
                        />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-1.5 text-sm font-medium">
                            Loại phòng
                            <select
                                required
                                value={values.roomTypeId || ""}
                                onChange={(event) =>
                                    setValues({
                                        ...values,
                                        roomTypeId: Number(event.target.value),
                                    })
                                }
                                className="h-10 w-full rounded-md border bg-background px-3"
                            >
                                <option value="" disabled>
                                    Chọn loại phòng
                                </option>

                                {roomTypes.map((type) => (
                                    <option key={type.roomTypeId} value={type.roomTypeId}>
                                        {type.roomTypeName || `Loại #${type.roomTypeId}`}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="space-y-1.5 text-sm font-medium">
                            Sức chứa
                            <Input
                                type="number"
                                min={1}
                                required
                                value={values.capacity}
                                onChange={(event) =>
                                    setValues({
                                        ...values,
                                        capacity: Number(event.target.value),
                                    })
                                }
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-1.5 text-sm font-medium">
                            Giá mỗi đêm
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min="100000"
                                    step="100000"
                                    required
                                    value={values.pricePerNight}
                                    onChange={(event) =>
                                        setValues({
                                            ...values,
                                            pricePerNight: Number(event.target.value),
                                        })
                                    }
                                />

                                <div className="flex flex-row gap-1">
                                    <button
                                        type="button"
                                        aria-label="Tăng giá mỗi đêm"
                                        className="rounded border px-3 py-2 text-sm hover:bg-accent"
                                        onClick={() =>
                                            setValues({
                                                ...values,
                                                pricePerNight:
                                                    Math.max(100000, values.pricePerNight) + 100000,
                                            })
                                        }
                                    >
                                        +
                                    </button>

                                    <button
                                        type="button"
                                        aria-label="Giảm giá mỗi đêm"
                                        disabled={values.pricePerNight <= 100000}
                                        className="rounded border px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
                                        onClick={() =>
                                            setValues({
                                                ...values,
                                                pricePerNight: Math.max(
                                                    100000,
                                                    values.pricePerNight - 100000
                                                ),
                                            })
                                        }
                                    >
                                        −
                                    </button>
                                </div>
                            </div>
                        </label>

                        <label className="space-y-1.5 text-sm font-medium">
                            Vị trí
                            <Input
                                maxLength={100}
                                value={values.location}
                                onChange={(event) =>
                                    setValues({
                                        ...values,
                                        location: event.target.value,
                                    })
                                }
                            />
                        </label>
                    </div>

                    {room && (
                        <label className="block space-y-1.5 text-sm font-medium">
                            Tình trạng
                            <select
                                value={values.status}
                                onChange={(event) =>
                                    setValues({
                                        ...values,
                                        status: Number(event.target.value),
                                    })
                                }
                                className="h-10 w-full rounded-md border bg-background px-3"
                            >
                                {roomStatuses.map((status, index) => (
                                    <option key={status} value={index}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}

                    <label className="block space-y-1.5 text-sm font-medium">
                        Mô tả
                        <textarea
                            maxLength={500}
                            value={values.description}
                            onChange={(event) =>
                                setValues({
                                    ...values,
                                    description: event.target.value,
                                })
                            }
                            className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />
                    </label>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-md border border-destructive/30 p-3 text-sm text-destructive"
                        >
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" disabled={saving} onClick={onClose}>
                            Hủy
                        </Button>

                        <Button type="submit" disabled={saving || roomTypes.length === 0}>
                            {saving ? "Đang lưu…" : room ? "Lưu thay đổi" : "Tạo phòng"}
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}
