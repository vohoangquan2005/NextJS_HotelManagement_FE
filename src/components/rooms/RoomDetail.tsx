"use client";

import { useEffect, useState } from "react";
import {
    BedDouble,
    MapPin,
    Users,
    CalendarDays,
    CircleAlert,
    Hash,
} from "lucide-react";

import { getRoomById } from "@/app/api/room.api";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { RoomResponseDto } from "@/types/room";
import RoomDetailSkeleton from "@/components/rooms/RoomDetailSkeleton"

interface RoomDetailProps {
    roomId: number;
}

export default function RoomDetail({ roomId }: RoomDetailProps) {
    const [room, setRoom] = useState<RoomResponseDto | null>(null);

    const { loading, error, setError, handleSubmit } =
        useFormSubmit<number, RoomResponseDto>(getRoomById, {
            onSuccess: (data) => setRoom(data),
        });

    useEffect(() => {
        if (!Number.isInteger(roomId) || roomId <= 0) {
            setRoom(null);
            setError("Mã phòng không hợp lệ.");
            return;
        }

        setRoom(null);
        void handleSubmit(roomId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    if (loading) {
        return (
            <div role="status" aria-label="Đang tải chi tiết phòng">
                <span className="sr-only">Đang tải thông tin phòng...</span>
                <RoomDetailSkeleton />
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
                    <CircleAlert className="size-7 text-destructive" />
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                    Không thể hiển thị phòng
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {error || "Không tìm thấy thông tin phòng."}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Ảnh minh họa */}
            <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-muted/40">
                <BedDouble
                    className="size-20 text-muted-foreground/30"
                    strokeWidth={1.2}
                />

                <div className="absolute bottom-3 left-3 rounded-full border bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
                    Phòng #{room.roomId}
                </div>
            </div>

            {/* Tên và loại phòng */}
            <div>
                <p className="text-sm font-medium text-primary">
                    {room.roomTypeName ?? `Loại phòng ${room.roomTypeId}`}
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                    {room.roomName ?? `Phòng ${room.roomId}`}
                </h2>

                {room.location && (
                    <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{room.location}</span>
                    </p>
                )}
            </div>

            {/* Giá phòng */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4 text-primary" />
                    Giá phòng mỗi đêm
                </div>

                <p className="mt-2 text-2xl font-bold text-primary">
                    {room.pricePerNight.toLocaleString("vi-VN")} đ
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    Giá cho một đêm lưu trú
                </p>
            </div>

            {/* Thông tin chính */}
            <section>
                <h3 className="mb-3 text-base font-semibold">
                    Thông tin phòng
                </h3>

                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border p-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                            <Users className="size-5 text-primary" />
                        </div>

                        <p className="mt-3 text-xs text-muted-foreground">
                            Sức chứa
                        </p>
                        <p className="mt-1 font-semibold">
                            {room.capacity} khách
                        </p>
                    </div>

                    <div className="rounded-xl border p-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                            <Hash className="size-5 text-primary" />
                        </div>

                        <p className="mt-3 text-xs text-muted-foreground">
                            Mã phòng
                        </p>
                        <p className="mt-1 font-semibold">{room.roomId}</p>
                    </div>
                </div>
            </section>

            {/* Mô tả */}
            <section>
                <h3 className="text-base font-semibold">Mô tả phòng</h3>

                <div className="mt-3 rounded-xl bg-muted/50 p-4">
                    <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                        {room.description || "Chưa có mô tả cho phòng này."}
                    </p>
                </div>
            </section>
        </div>
    );
}
