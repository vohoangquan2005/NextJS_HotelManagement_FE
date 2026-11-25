"use client";

import type { ReactNode } from "react";

import {
    BedDouble,
    MapPin,
    Users,
    ArrowRight,
} from "lucide-react";

import type { RoomResponseDto } from "@/types/room";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { sortRoomImages } from "@/lib/room-images";

interface RoomCardProps {
    room: RoomResponseDto;
    onSelect?: (roomId: number) => void;
    isSelected?: boolean;
    extraAction?: ReactNode;
}

export default function RoomCard({
    room,
    onSelect,
    isSelected = false,
    extraAction,
}: RoomCardProps) {
    const primaryImage = sortRoomImages(room.roomImages)[0];

    return (
        <article
            className={`w-full overflow-hidden rounded-2xl border bg-card text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
                isSelected
                    ? "border-primary ring-1 ring-primary"
                    : ""
            }`}
        >
            <div className="relative h-44 overflow-hidden bg-muted">
                <ImageWithFallback
                    src={primaryImage?.imageUrl}
                    alt={room.roomName ?? `Phòng ${room.roomId}`}
                    className="h-full w-full object-cover"
                    fallback={(
                        <div className="flex h-full items-center justify-center">
                            <BedDouble className="size-16 text-muted-foreground/50" strokeWidth={1.2} />
                        </div>
                    )}
                />
            </div>

            <div className="p-5">
                <p className="text-sm font-medium text-primary">
                    {room.roomTypeName ??
                        `Loại phòng ${room.roomTypeId}`}
                </p>

                <h2 className="mt-2 text-lg font-semibold">
                    {room.roomName ?? `Phòng ${room.roomId}`}
                </h2>

                {room.location && (
                    <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="size-4 shrink-0" />
                        <span className="line-clamp-1">
                            {room.location}
                        </span>
                    </p>
                )}

                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="size-4" />
                    <span>{room.capacity} khách</span>
                </div>

                <div className="mt-5 flex items-end justify-between border-t pt-4">
                    <div>
                        <p className="text-xs text-muted-foreground">
                            Giá mỗi đêm
                        </p>

                        <p className="mt-1 text-lg font-bold text-primary">
                            {room.pricePerNight.toLocaleString("vi-VN")} đ
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {extraAction}
                        <Button
                            onClick={() => onSelect?.(room.roomId)}
                            aria-pressed={isSelected}
                            className="inline-flex h-9 items-center gap-1 rounded-md border border-primary bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 hover:text-primary-foreground"
                        >
                            Chi tiết
                            <ArrowRight className="ml-1 size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    );
}
