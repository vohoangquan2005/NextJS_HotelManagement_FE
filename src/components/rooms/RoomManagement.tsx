"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    BedDouble,
    CircleAlert,
    LoaderCircle,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    Undo2,
    Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { Input } from "@/components/ui/input";
import {
    getAll,
    getDeletedRooms,
    restoreRoom,
    softDeleteRoom,
    deleteRoom,
    createRoom,
    updateRoom,
} from "@/app/api/room.api";
import { getRoomTypes } from "@/app/api/room-type.api";
import { RoomEditor, type EditorValues } from "@/components/rooms/RoomForm";

import type { RoomCreateDto, RoomResponseDto, RoomTypeOption, RoomUpdateDto } from "@/types/room";

const roomStatuses = ["Sẵn sàng", "Đang sử dụng", "Đang dọn dẹp", "Đang bảo trì"];

const money = (value: number) => `${value.toLocaleString("vi-VN")} VNĐ`;

export default function RoomManagement() {
    const [rooms, setRooms] = useState<RoomResponseDto[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomTypeOption[]>([]);
    const [search, setSearch] = useState("");
    const [showDeleted, setShowDeleted] = useState(false);
    const [editing, setEditing] = useState<RoomResponseDto | null | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async (deleted: boolean) => {
        setLoading(true);
        setError("");

        try {
            const data = deleted ? await getDeletedRooms() : await getAll();
            setRooms(Array.isArray(data) ? data : []);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Không thể tải phòng.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;

        void getAll()
            .then((data) => {
                if (active) setRooms(Array.isArray(data) ? data : []);
            })
            .catch((cause: unknown) => {
                if (active) {
                    setError(cause instanceof Error ? cause.message : "Không thể tải phòng.");
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        void getRoomTypes()
            .then((data) => {
                if (active) setRoomTypes(Array.isArray(data) ? data : []);
            })
            .catch((cause: unknown) => {
                if (active) {
                    setError(cause instanceof Error ? cause.message : "Không thể tải loại phòng.");
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const visibleRooms = useMemo(() => {
        if (!Array.isArray(rooms)) return [];
        const query = search.trim().toLocaleLowerCase("vi");

        return rooms.filter(
            (room) =>
                !query ||
                `${room.roomName ?? ""} ${room.roomTypeName ?? ""} ${room.location ?? ""}`
                    .toLocaleLowerCase("vi")
                    .includes(query),
        );
    }, [rooms, search]);

    async function saveRoom(values: EditorValues) {
        if (editing === null) {
            const data: RoomCreateDto = {
                roomName: values.roomName.trim(),
                roomTypeId: values.roomTypeId,
                capacity: values.capacity,
                location: values.location.trim() || null,
                pricePerNight: values.pricePerNight,
                description: values.description.trim() || null,
            };

            await createRoom(data);
        } else if (editing) {
            const data: RoomUpdateDto = {
                roomName: values.roomName.trim(),
                roomTypeId: values.roomTypeId,
                capacity: values.capacity,
                location: values.location.trim() || null,
                pricePerNight: values.pricePerNight,
                description: values.description.trim() || null,
                status: values.status,
            };

            await updateRoom(editing.roomId, data);
        }

        setEditing(undefined);
        await load(false);
    }

    async function changeState(room: RoomResponseDto) {
        const action = showDeleted ? "khôi phục" : "xóa mềm";

        if (!window.confirm(`Xác nhận ${action} ${room.roomName || `phòng #${room.roomId}`}?`)) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            if (showDeleted) {
                await restoreRoom(room.roomId);
            } else {
                await softDeleteRoom(room.roomId);
            }

            await load(showDeleted);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : `Không thể ${action} phòng.`);
            setLoading(false);
        }
    }

    async function permanentlyDelete(room: RoomResponseDto) {
        if (
            !window.confirm(
                `Xóa vĩnh viễn phòng ${
                    room.roomName || `#${room.roomId}`
                }? Thao tác này không thể hoàn tác.`,
            )
        ) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            await deleteRoom(room.roomId);
            await load(true);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Không thể xóa vĩnh viễn phòng.");
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Quản lý phòng
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        {showDeleted ? "Phòng đã xóa mềm" : "Danh mục phòng"}
                    </h1>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        disabled={showDeleted || roomTypes.length === 0}
                        onClick={() => setEditing(null)}
                    >
                        <Plus className="mr-2 size-4" />
                        Thêm phòng
                    </Button>

                    <button
                        onClick={() => {
                            const next = !showDeleted;
                            setShowDeleted(next);
                            setSearch("");
                            void load(next);
                        }}
                        className="h-10 rounded-md border px-4 text-sm font-medium"
                    >
                        {showDeleted ? "Xem phòng đang hoạt động" : "Xem phòng đã xóa"}
                    </button>
                </div>
            </div>

            {!roomTypes.length && !showDeleted && (
                <p className="text-xs text-muted-foreground">
                    {loading
                        ? "Đang tải loại phòng…"
                        : "Không có loại phòng khả dụng; không thể tạo phòng cho đến khi có loại phòng."}
                </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative max-w-lg flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        className="pl-9"
                        placeholder="Tìm tên phòng, loại phòng, vị trí"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <button
                    onClick={() => void load(showDeleted)}
                    disabled={loading}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm disabled:opacity-50"
                >
                    <RefreshCw className="size-4" />
                    Làm mới
                </button>
            </div>

            {error && (
                <div
                    role="alert"
                    className="flex items-center gap-2 rounded-xl border border-destructive/30 p-4 text-sm text-destructive"
                >
                    <CircleAlert className="size-5" />
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex min-h-48 items-center justify-center gap-3 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải phòng…
                </div>
            ) : visibleRooms.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-10 text-center">
                    <BedDouble className="mx-auto size-8 text-muted-foreground/60" />

                    <p className="mt-3 text-sm text-muted-foreground">
                        {rooms.length
                            ? "Không tìm thấy kết quả."
                            : "Không có phòng trong danh sách này."}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full min-w-[820px] text-left text-sm">
                        <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3">Ảnh</th>
                                <th className="px-4 py-3">Phòng</th>
                                <th className="px-4 py-3">Loại</th>
                                <th className="px-4 py-3">Sức chứa</th>
                                <th className="px-4 py-3">Giá / đêm</th>
                                <th className="px-4 py-3">Tình trạng</th>
                                <th className="px-4 py-3 text-right">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {visibleRooms.map((room) => (
                                <tr key={room.roomId} className="hover:bg-muted/30">
                                    <td className="px-4 py-3">
                                        <div className="size-16 overflow-hidden rounded-md bg-muted">
                                            <ImageWithFallback
                                                src={room.roomImages?.[0]?.imageUrl}
                                                alt={room.roomName || `Phòng ${room.roomId}`}
                                                className="size-full object-cover"
                                                fallback={<div className="flex size-full items-center justify-center"><BedDouble className="size-6 text-muted-foreground/50" /></div>}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium">
                                            {room.roomName || `Phòng ${room.roomId}`}
                                        </p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {room.location || "Chưa có vị trí"}
                                        </p>
                                    </td>

                                    <td className="px-4 py-3">
                                        {room.roomTypeName || `Loại #${room.roomTypeId}`}
                                    </td>

                                    <td className="px-4 py-3">{room.capacity} khách</td>

                                    <td className="px-4 py-3 font-medium">
                                        {money(room.pricePerNight)}
                                    </td>

                                    <td className="px-4 py-3">
                                        <span className="rounded-full border bg-muted px-2.5 py-1 text-xs">
                                            {roomStatuses[Number(room.status)] ??
                                                String(room.status)}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        <div className="inline-flex flex-wrap justify-end gap-2">
                                            {!showDeleted ? (
                                                <>
                                                    <button
                                                        disabled={loading}
                                                        onClick={() => setEditing(room)}
                                                        className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs disabled:opacity-50"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                        Sửa
                                                    </button>

                                                    <button
                                                        disabled={loading}
                                                        onClick={() => void changeState(room)}
                                                        className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs text-destructive disabled:opacity-50"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                        Xóa mềm
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        disabled={loading}
                                                        onClick={() => void changeState(room)}
                                                        className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs disabled:opacity-50"
                                                    >
                                                        <Undo2 className="size-3.5" />
                                                        Khôi phục
                                                    </button>

                                                    <button
                                                        disabled={loading}
                                                        onClick={() => void permanentlyDelete(room)}
                                                        className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs text-destructive disabled:opacity-50"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                        Xóa vĩnh viễn
                                                    </button>
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

            {editing !== undefined && (
                <RoomEditor
                    room={editing}
                    roomTypes={roomTypes}
                    onClose={() => setEditing(undefined)}
                    onSave={saveRoom}
                />
            )}
        </div>
    );
}
