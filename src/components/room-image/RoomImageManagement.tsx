"use client";
import { useCallback, useEffect, useState } from "react";
import { LoaderCircle, RefreshCw, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { RoomImageForm } from "@/components/room-image/RoomImageForm";
import {
    createRoomImage,
    deleteRoomImage,
    getRoomImages,
    updateRoomImage,
} from "@/app/api/room-image.api";
import { getAll } from "@/app/api/room.api";
import type { RoomImageDto } from "@/types/room-image";
import type { RoomResponseDto } from "@/types/room";
export default function RoomImageManagement() {
    const [items, setItems] = useState<RoomImageDto[]>([]);
    const [rooms, setRooms] = useState<RoomResponseDto[]>([]);
    const [roomId, setRoomId] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [primary, setPrimary] = useState(false);
    const [order, setOrder] = useState("0");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [images, roomRows] = await Promise.all([getRoomImages(), getAll()]);
            setItems(Array.isArray(images) ? images : []);
            setRooms(Array.isArray(roomRows) ? roomRows : []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể tải ảnh phòng.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        Promise.all([getRoomImages(), getAll()])
            .then(([images, roomRows]) => {
                if (active) {
                    setItems(Array.isArray(images) ? images : []);
                    setRooms(Array.isArray(roomRows) ? roomRows : []);
                }
            })
            .catch((e) => {
                if (active) setError(e instanceof Error ? e.message : "Không thể tải ảnh phòng.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);
    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!file) {
            setError("Vui lòng chọn tệp ảnh.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            await createRoomImage({
                roomId: Number(roomId),
                image: file,
                isPrimary: primary ? 1 : 0,
                displayOrder: Number(order),
            });
            setNotice("Đã tải ảnh phòng lên.");
            setFile(null);
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể tải ảnh lên.");
        } finally {
            setSaving(false);
        }
    }
    async function remove(item: RoomImageDto) {
        if (
            !window.confirm(
                `Xóa ảnh phòng #${item.roomImageId}? Ảnh trên kho lưu trữ cũng sẽ bị xóa.`,
            )
        )
            return;
        try {
            await deleteRoomImage(item.roomImageId);
            setNotice("Đã xóa ảnh phòng.");
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể xóa ảnh.");
        }
    }
    async function edit(item: RoomImageDto) {
        const primaryValue = window.prompt("Ảnh chính? Nhập 1 hoặc 0", String(item.isPrimary));
        if (primaryValue === null) return;
        const orderValue = window.prompt("Thứ tự hiển thị", String(item.displayOrder));
        if (orderValue === null) return;
        const isPrimary = Number(primaryValue);
        const displayOrder = Number(orderValue);
        if (![0, 1].includes(isPrimary) || !Number.isInteger(displayOrder) || displayOrder < 0) {
            setError("Ảnh chính phải là 0 hoặc 1; thứ tự hiển thị phải là số nguyên không âm.");
            return;
        }
        try {
            await updateRoomImage(item.roomImageId, { isPrimary, displayOrder });
            setNotice("Đã cập nhật thông tin hiển thị ảnh.");
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể cập nhật ảnh.");
        }
    }
    return (
        <section className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Danh mục phòng
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">Ảnh phòng</h1>
                </div>
                <Button variant="outline" onClick={() => void load()} disabled={loading}>
                    <RefreshCw className="mr-2 size-4" />
                    Làm mới
                </Button>
            </header>
            {notice && (
                <p
                    role="status"
                    className="rounded-lg border border-emerald-600/30 p-3 text-sm text-emerald-700"
                >
                    {notice}
                </p>
            )}
            {error && (
                <p
                    role="alert"
                    className="rounded-lg border border-destructive/30 p-3 text-sm text-destructive"
                >
                    {error}
                </p>
            )}
            <RoomImageForm
                rooms={rooms}
                roomId={roomId}
                setRoomId={setRoomId}
                setFile={setFile}
                primary={primary}
                setPrimary={setPrimary}
                order={order}
                setOrder={setOrder}
                saving={saving}
                loading={loading}
                onSubmit={submit}
            />
            {loading ? (
                <div className="flex min-h-40 items-center justify-center gap-2 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải…
                </div>
            ) : items.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                    Chưa có ảnh phòng.
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((x) => (
                        <article
                            key={x.roomImageId}
                            className="overflow-hidden rounded-xl border bg-card"
                        >
                            <div className="aspect-[4/3] bg-muted">
                                {x.imageUrl ? (
                                    <ImageWithFallback
                                        src={x.imageUrl}
                                        alt={x.roomName || `Ảnh phòng ${x.roomId}`}
                                        className="h-full w-full object-cover"
                                        fallback={<div className="flex h-full items-center justify-center text-sm text-muted-foreground">Không tải được ảnh</div>}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                        Không có URL ảnh
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between gap-2 p-3">
                                <div>
                                    <h2 className="font-medium">
                                        {x.roomName || `Phòng #${x.roomId}`}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Thứ tự {x.displayOrder}
                                        {x.isPrimary === 1 ? " · Ảnh chính" : ""}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => void edit(x)}
                                    >
                                        <Save className="mr-1 size-3" />
                                        Sửa
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Xóa ảnh"
                                        onClick={() => void remove(x)}
                                    >
                                        <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
