"use client";

import Link from "next/link";
import {
    BedDouble,
    MapPin,
    Users,
    ArrowRight,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import type { RoomResponseDto } from "@/types/room";

interface RoomCardProps {
    room: RoomResponseDto;
    onSelect: (roomId: number) => void;
}

export default function RoomCard({ room, onSelect }: RoomCardProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(room.roomId)}
            className="w-full overflow-hidden rounded-2xl border bg-card text-left transition hover:shadow-lg"
            >
            <div className="flex h-44 items-center justify-center bg-muted">
                <BedDouble
                    className="size-16 text-muted-foreground/50"
                    strokeWidth={1.2}
                />
            </div>

            <div className="p-5">
                <p className="text-sm font-medium text-primary">
                    {room.roomTypeName ?? `Loại phòng ${room.roomTypeId}`}
                </p>

                <h2 className="mt-2 text-lg font-semibold">
                    {room.roomName ?? `Phòng ${room.roomId}`}
                </h2>

                {room.location && (
                    <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="size-4 shrink-0" />
                        <span className="line-clamp-1">{room.location}</span>
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

                    <span
                        className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                        })}
                    >
                        Chi tiết
                        <ArrowRight className="ml-1 size-4" />
                    </span>
                </div>
            </div>
        </button>
    );
}
