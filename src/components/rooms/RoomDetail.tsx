
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    BedDouble,
    MapPin,
    Users,
    CalendarDays,
    CircleAlert,
    Hash,
    Heart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

import {
    addFavoriteRoom,
    getMyFavoriteRooms,
    removeFavoriteRoom,
} from "@/app/api/favorite-room.api";

import type { FavoriteRoomResponseDto } from "@/types/favorite-room";

import { getRoomById } from "@/app/api/room.api";

import { useFormSubmit } from "@/hooks/useFormSubmit";

import type { RoomResponseDto } from "@/types/room";

import RoomDetailSkeleton from "@/components/rooms/RoomDetailSkeleton";
import RoomReviews from "@/components/rooms/RoomReviews";
import ImageWithFallback from "@/components/common/ImageWithFallback";

import { sortRoomImages } from "@/lib/room-images";

interface RoomDetailProps {
    roomId: number;
}

export default function RoomDetail({ roomId }: RoomDetailProps) {
    const router = useRouter();
    const { user } = useAuth();

    const [room, setRoom] = useState<RoomResponseDto | null>(null);
    const [selectedRoomImageId, setSelectedRoomImageId] = useState<number | null>(null);

    const [favorite, setFavorite] = useState<FavoriteRoomResponseDto | null>(
        null,
    );

    const [favoriteBusy, setFavoriteBusy] = useState(false);
    const [favoriteMessage, setFavoriteMessage] = useState("");

    const { loading, error, setError, handleSubmit } = useFormSubmit<
        number,
        RoomResponseDto
    >(getRoomById, {
        onSuccess: (data) => setRoom(data),
    });

    // Tải thông tin phòng
    useEffect(() => {
        if (!Number.isInteger(roomId) || roomId <= 0) {
            queueMicrotask(() => setError("Mã phòng không hợp lệ."));
            return;
        }

        void handleSubmit(roomId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    // Tải trạng thái yêu thích
    useEffect(() => {
        let active = true;

        if (user?.roleName !== "Customer") {
            return;
        }

        void getMyFavoriteRooms()
            .then((items) => {
                if (active) {
                    setFavorite(
                        items.find((item) => item.roomId === roomId) ?? null,
                    );
                }
            })
            .catch(() => {
                if (active) {
                    setFavoriteMessage(
                        "Không thể tải trạng thái yêu thích.",
                    );
                }
            });

        return () => {
            active = false;
        };
    }, [roomId, user?.roleName]);

    // Thêm hoặc xóa yêu thích
    async function toggleFavorite() {
        if (user?.roleName !== "Customer") {
            router.push(
                `/login?redirect=${encodeURIComponent(`/rooms/${roomId}`)}`,
            );
            return;
        }

        setFavoriteBusy(true);
        setFavoriteMessage("");

        try {
            if (favorite) {
                await removeFavoriteRoom(favorite.favoriteRoomId);
                setFavorite(null);

                setFavoriteMessage(
                    "Đã xóa phòng khỏi danh sách yêu thích.",
                );
            } else {
                setFavorite(await addFavoriteRoom({ roomId }));

                setFavoriteMessage(
                    "Đã thêm phòng vào danh sách yêu thích.",
                );
            }
        } catch (cause) {
            setFavoriteMessage(
                cause instanceof Error
                    ? cause.message
                    : "Không thể cập nhật yêu thích.",
            );
        } finally {
            setFavoriteBusy(false);
        }
    }

    // Hiển thị trạng thái tải phòng
    if (loading) {
        return (
            <div role="status" aria-label="Đang tải chi tiết phòng">
                <span className="sr-only">
                    Đang tải thông tin phòng...
                </span>

                <RoomDetailSkeleton />
            </div>
        );
    }

    // Hiển thị lỗi
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

    // Xử lý hình ảnh phòng
    const roomImages = sortRoomImages(room.roomImages);

    const selectedRoomImage =
        roomImages.find(
            (image) => image.roomImageId === selectedRoomImageId,
        ) ?? roomImages[0];

    const secondaryRoomImages = roomImages.filter(
        (image) =>
            image.roomImageId !== selectedRoomImage?.roomImageId,
    );

    return (
        <div className="space-y-6">
            {/* Ảnh minh họa */}
            <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-muted/40">
                <ImageWithFallback
                    src={selectedRoomImage?.imageUrl}
                    alt={room.roomName ?? `Phòng ${room.roomId}`}
                    className="absolute inset-0 size-full object-cover"
                    fallback={
                        <BedDouble
                            className="size-20 text-muted-foreground/30"
                            strokeWidth={1.2}
                        />
                    }
                />

                <div className="absolute bottom-3 left-3 rounded-full border bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
                    Phòng #{room.roomId}
                </div>
            </div>

            {/* Danh sách ảnh phụ */}
            {secondaryRoomImages.length > 0 && (
                <div
                    className="flex gap-3 overflow-x-auto pb-1"
                    aria-label="Ảnh phòng"
                >
                    {secondaryRoomImages.map((image, index) => (
                        <button
                            key={image.roomImageId}
                            type="button"
                            onClick={() =>
                                setSelectedRoomImageId(image.roomImageId)
                            }
                            aria-label={`Xem ảnh phòng ${index + 1}`}
                            className={`size-20 shrink-0 overflow-hidden rounded-lg border-2 bg-muted ${
                                selectedRoomImage?.roomImageId === image.roomImageId
                                    ? "border-primary"
                                    : "border-transparent"
                            }`}
                        >
                            <ImageWithFallback
                                src={image.imageUrl}
                                alt={`${
                                    room.roomName ?? `Phòng ${room.roomId}`
                                } - ảnh ${index + 1}`}
                                className="size-full object-cover"
                                fallback={
                                    <BedDouble className="size-7 text-muted-foreground/50" />
                                }
                            />
                        </button>
                    ))}
                </div>
            )}

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

            {/* Các thao tác */}
            <div className="flex flex-wrap gap-2">
                {(user === null || user.roleName === "Customer") && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => void toggleFavorite()}
                        disabled={favoriteBusy}
                    >
                        <Heart
                            className={`mr-2 size-4 ${
                                favorite
                                    ? "fill-current text-rose-600"
                                    : ""
                            }`}
                        />

                        {favoriteBusy
                            ? "Đang cập nhật…"
                            : favorite
                                ? "Bỏ yêu thích"
                                : "Thêm yêu thích"}
                    </Button>
                )}

                {(user === null || user.roleName === "Customer") && (
                    <Button
                        nativeButton={false}
                        render={
                            <Link
                                href={
                                    user
                                        ? `/booking?roomId=${roomId}`
                                        : `/login?redirect=${encodeURIComponent(
                                            `/booking?roomId=${roomId}`,
                                        )}`
                                }
                            />
                        }
                    >
                        Đặt phòng
                    </Button>
                )}
            </div>

            {/* Thông báo yêu thích */}
            {favoriteMessage && (
                <p
                    role="status"
                    className="text-sm text-muted-foreground"
                >
                    {favoriteMessage}
                </p>
            )}

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

                        <p className="mt-1 font-semibold">
                            {room.roomId}
                        </p>
                    </div>
                </div>
            </section>

            {/* Mô tả */}
            <section>
                <h3 className="text-base font-semibold">
                    Mô tả phòng
                </h3>

                <div className="mt-3 rounded-xl bg-muted/50 p-4">
                    <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                        {room.description ||
                            "Chưa có mô tả cho phòng này."}
                    </p>
                </div>
            </section>

            {/* Đánh giá phòng */}
            <RoomReviews
                key={roomId}
                roomId={roomId}
            />
        </div>
    );
}
