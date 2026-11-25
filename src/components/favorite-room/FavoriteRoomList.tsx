"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart, LoaderCircle, RefreshCw, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoomCard from "@/components/rooms/RoomCard";
import RoomDetail from "@/components/rooms/RoomDetail";
import { getRoomById } from "@/app/api/room.api";
import { getMyFavoriteRooms, removeFavoriteRoom } from "@/app/api/favorite-room.api";
import type { FavoriteRoomResponseDto } from "@/types/favorite-room";
import type { RoomResponseDto } from "@/types/room";

interface FavoriteRoomItem {
    favorite: FavoriteRoomResponseDto;
    room: RoomResponseDto | null;
}

export default function FavoriteRoomList() {
    const [items, setItems] = useState<FavoriteRoomItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [workingId, setWorkingId] = useState<number | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const favorites = await getMyFavoriteRooms();
            const loadedRooms = await Promise.all(
                favorites.map(async (favorite) => {
                    try {
                        return {
                            favorite,
                            room: await getRoomById(favorite.roomId),
                        };
                    } catch {
                        return { favorite, room: null };
                    }
                }),
            );
            setItems(loadedRooms);
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể tải danh sách yêu thích.",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(() => void load());
    }, [load]);

    async function remove(item: FavoriteRoomItem) {
        const favoriteId = item.favorite.favoriteRoomId;
        setWorkingId(favoriteId);
        setError("");

        try {
            await removeFavoriteRoom(favoriteId);
            setItems((current) =>
                current.filter((row) => row.favorite.favoriteRoomId !== favoriteId),
            );
            if (item.room?.roomId === selectedRoomId) {
                setSelectedRoomId(null);
            }
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể xóa phòng yêu thích.",
            );
        } finally {
            setWorkingId(null);
        }
    }

    return (
        <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Tài khoản khách hàng
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">Phòng yêu thích</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Các phòng bạn đã lưu để xem lại sau.
                    </p>
                </div>
                <Button variant="outline" onClick={() => void load()} disabled={loading}>
                    <RefreshCw className="mr-2 size-4" />
                    Làm mới
                </Button>
            </header>

            {error && (
                <p role="alert" className="rounded-lg border border-destructive/30 p-3 text-sm text-destructive">
                    {error}
                </p>
            )}

            {loading ? (
                <div className="flex min-h-48 items-center justify-center gap-2 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải…
                </div>
            ) : items.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                    <Heart className="mx-auto mb-3 size-7" />
                    Bạn chưa lưu phòng yêu thích.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => item.room ? (
                        <RoomCard
                            key={item.favorite.favoriteRoomId}
                            room={item.room}
                            onSelect={setSelectedRoomId}
                            isSelected={selectedRoomId === item.room.roomId}
                            extraAction={(
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    aria-label={`Bỏ yêu thích ${item.room.roomName ?? "phòng"}`}
                                    title="Bỏ yêu thích"
                                    disabled={workingId === item.favorite.favoriteRoomId}
                                    onClick={() => void remove(item)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            )}
                        />
                    ) : (
                        <article key={item.favorite.favoriteRoomId} className="flex flex-col justify-between gap-4 rounded-2xl border bg-card p-5">
                            <div>
                                <h2 className="font-semibold">
                                    {item.favorite.roomName || `Phòng #${item.favorite.roomId}`}
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Phòng hiện không còn khả dụng.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                className="self-start"
                                disabled={workingId === item.favorite.favoriteRoomId}
                                onClick={() => void remove(item)}
                            >
                                <Trash2 className="mr-2 size-4" />
                                Bỏ yêu thích
                            </Button>
                        </article>
                    ))}
                </div>
            )}

            {selectedRoomId !== null && (
                <aside className="rounded-2xl border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b px-5 py-3">
                        <h2 className="font-semibold">Chi tiết phòng</h2>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedRoomId(null)}
                            aria-label="Đóng chi tiết phòng"
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                    <div className="p-5">
                        <RoomDetail key={selectedRoomId} roomId={selectedRoomId} />
                    </div>
                </aside>
            )}
        </section>
    );
}
