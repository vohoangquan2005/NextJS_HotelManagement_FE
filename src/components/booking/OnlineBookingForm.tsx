
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    CalendarDays,
    CheckCircle2,
    CircleAlert,
    LoaderCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { getAll } from "@/app/api/room.api";
import { createOnlineBooking } from "@/app/api/booking.api";
import { getServicePackages } from "@/app/api/service-package.api";

import type { RoomResponseDto } from "@/types/room";
import type { ServicePackageDto } from "@/types/service-package";
import type {
    BookingCreateOnlineDto,
    BookingResponseDto,
} from "@/types/booking";

function todayInput() {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

    return date.toISOString().slice(0, 16);
}

export default function OnlineBookingForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isLoading: authLoading } = useAuth();

    const [rooms, setRooms] = useState<RoomResponseDto[]>([]);
    const [servicePackages, setServicePackages] = useState<ServicePackageDto[]>([]);
    const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);
    const [roomGuests, setRoomGuests] = useState<Record<number, number>>({});
    const [servicePackageId, setServicePackageId] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [packageError, setPackageError] = useState("");
    const [created, setCreated] = useState<BookingResponseDto | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.replace(
                `/login?redirect=${encodeURIComponent(`/booking${searchParams.toString() ? `?${searchParams.toString()}` : ""}`)}`,
            );
            return;
        }

        if (user.roleName !== "Customer") {
            router.replace("/");
            return;
        }

        let active = true;

        void (async () => {
            try {
                const [roomResult, packageResult] = await Promise.allSettled([
                    getAll(),
                    getServicePackages(),
                ]);

                if (roomResult.status === "rejected") {
                    throw roomResult.reason;
                }

                if (active) {
                    setRooms(roomResult.value);
                    setServicePackages(
                        packageResult.status === "fulfilled"
                            ? packageResult.value
                            : [],
                    );
                    setPackageError(
                        packageResult.status === "rejected"
                            ? (
                                packageResult.reason instanceof Error
                                    ? packageResult.reason.message
                                    : "Không thể tải gói dịch vụ."
                            )
                            : "",
                    );

                    const preferredRoomId = Number(searchParams.get("roomId"));

                    if (
                        Number.isInteger(preferredRoomId) &&
                        roomResult.value.some(
                            (room) => room.roomId === preferredRoomId,
                        )
                    ) {
                        setSelectedRoomIds([preferredRoomId]);
                        setRoomGuests({ [preferredRoomId]: 1 });
                    }
                }
            } catch (cause) {
                if (active) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : "Không thể tải danh sách phòng.",
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [authLoading, user, router, searchParams]);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const chosenRooms = rooms.filter(
            (room) => selectedRoomIds.includes(room.roomId),
        );

        const bookingDetails = chosenRooms.map((room) => ({
            roomId: room.roomId,
            guestCount: roomGuests[room.roomId] ?? 1,
        }));

        const guestCount = bookingDetails.reduce(
            (total, detail) => total + detail.guestCount,
            0,
        );

        if (chosenRooms.length === 0) {
            setError("Vui lòng chọn ít nhất một phòng.");
            return;
        }

        if (new Date(checkOut) <= new Date(checkIn)) {
            setError("Ngày trả phòng phải sau ngày nhận phòng.");
            return;
        }

        const overCapacity = chosenRooms.find(
            (room) => (roomGuests[room.roomId] ?? 1) > room.capacity,
        );

        if (overCapacity) {
            setError(
                `Phòng ${overCapacity.roomName || `#${overCapacity.roomId}`} có sức chứa tối đa ${overCapacity.capacity} khách.`,
            );
            return;
        }

        const payload: BookingCreateOnlineDto = {
            expectedCheckIn: new Date(checkIn).toISOString(),
            expectedCheckOut: new Date(checkOut).toISOString(),
            guestCount,
            roomCount: bookingDetails.length,
            promotionId: null,
            servicePackageId: servicePackageId
                ? Number(servicePackageId)
                : null,
            note: note.trim() || null,
            bookingDetails,
        };

        setSubmitting(true);

        try {
            setCreated(await createOnlineBooking(payload));
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể tạo đặt phòng.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (
        authLoading ||
        !user ||
        user.roleName !== "Customer"
    ) {
        return (
            <div className="mx-auto flex min-h-96 max-w-4xl items-center justify-center gap-3 text-muted-foreground">
                <LoaderCircle className="size-5 animate-spin" />
                Đang kiểm tra phiên đăng nhập…
            </div>
        );
    }

    if (created) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16">
                <div className="rounded-3xl border bg-card p-8 text-center sm:p-12">
                    <CheckCircle2 className="mx-auto size-14 text-emerald-600" />

                    <h1 className="mt-2 text-3xl font-bold">
                        Mã đặt phòng #{created.bookingId}
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                        Trạng thái hiện tại: {String(created.status)}. Giao dịch đặt cọc đã được tạo và đang chờ bạn gửi thông tin thanh toán để nhân viên đối soát.
                    </p>

                    <div className="mt-6 rounded-2xl bg-muted/50 p-5 text-left text-sm">
                        <p>
                            Nhận phòng:{" "}
                            <strong>
                                {new Date(created.expectedCheckIn).toLocaleString(
                                    "vi-VN",
                                )}
                            </strong>
                        </p>

                        <p className="mt-2">
                            Trả phòng:{" "}
                            <strong>
                                {new Date(created.expectedCheckOut).toLocaleString(
                                    "vi-VN",
                                )}
                            </strong>
                        </p>

                        <p className="mt-2">
                            Giá phòng: <strong>{created.roomAmount.toLocaleString("vi-VN")} VNĐ</strong>
                        </p>
                        {created.promotionName && created.discountAmount > 0 && (
                            <p className="mt-2">
                                Khuyến mãi {created.promotionName}{created.discountValue != null
                                    ? ` (${created.discountType === 1
                                        ? `${created.discountValue.toLocaleString("vi-VN")} VNĐ`
                                        : `${created.discountValue}%`})`
                                    : ""}: giảm <strong>{created.discountAmount.toLocaleString("vi-VN")} VNĐ</strong>
                            </p>
                        )}
                        <p className="mt-2">
                            Tổng tiền sau giảm: <strong>{created.totalAmount.toLocaleString("vi-VN")} VNĐ</strong>
                        </p>
                        <p className="mt-2">
                            Tiền đặt cọc:{" "}
                            <strong>
                                {created.depositAmount.toLocaleString("vi-VN")} VNĐ
                            </strong>
                        </p>
                    </div>

                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                        <Link
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                            href="/bookings"
                        >
                            Xem đặt phòng của tôi
                        </Link>

                        <Link
                            className="rounded-lg border px-4 py-2 text-sm font-medium"
                            href="/rooms"
                        >
                            Tiếp tục xem phòng
                        </Link>
                        <Link className="rounded-lg border px-4 py-2 text-sm font-medium" href="/payments">Đi tới thanh toán</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                    Đặt phòng trực tuyến
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Thông tin lưu trú
                </h1>

            </div>

            {loading ? (
                <div className="flex min-h-48 items-center justify-center gap-3 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải phòng…
                </div>
            ) : (
                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-2xl border bg-card p-5 sm:p-8"
                >
                    {error && (
                        <div
                            role="alert"
                            className="flex gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
                        >
                            <CircleAlert className="size-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <fieldset className="space-y-3">
                        <legend className="text-sm font-medium">
                            Phòng và số khách theo phòng
                        </legend>

                        <p className="text-xs text-muted-foreground">
                            Đã chọn {selectedRoomIds.length} phòng · tổng cộng{" "}
                            {selectedRoomIds.reduce(
                                (total, id) => total + (roomGuests[id] ?? 1),
                                0,
                            )}{" "}
                            khách
                        </p>

                        {rooms.length === 0 ? (
                            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                Không có phòng để chọn.
                            </p>
                        ) : (
                            <div className="grid gap-2 sm:grid-cols-2">
                                {rooms.map((room) => {
                                    const selected = selectedRoomIds.includes(
                                        room.roomId,
                                    );

                                    return (
                                        <div
                                            key={room.roomId}
                                            className="rounded-lg border p-3"
                                        >
                                            <label className="flex items-start gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={selected}
                                                    onChange={(event) => {
                                                        if (event.target.checked) {
                                                            setSelectedRoomIds(
                                                                (current) => [
                                                                    ...current,
                                                                    room.roomId,
                                                                ],
                                                            );

                                                            setRoomGuests(
                                                                (current) => ({
                                                                    ...current,
                                                                    [room.roomId]:
                                                                        current[
                                                                            room.roomId
                                                                        ] ?? 1,
                                                                }),
                                                            );
                                                        } else {
                                                            setSelectedRoomIds(
                                                                (current) =>
                                                                    current.filter(
                                                                        (id) =>
                                                                            id !==
                                                                            room.roomId,
                                                                    ),
                                                            );
                                                        }
                                                    }}
                                                />

                                                <span>
                                                    <strong>
                                                        {room.roomName ||
                                                            `Phòng ${room.roomId}`}
                                                    </strong>

                                                    <span className="block text-xs text-muted-foreground">
                                                        {room.roomTypeName || ""} · tối đa{" "}
                                                        {room.capacity} khách ·{" "}
                                                        {room.pricePerNight.toLocaleString(
                                                            "vi-VN",
                                                        )}{" "}
                                                        VNĐ/đêm
                                                    </span>
                                                </span>
                                            </label>

                                            {selected && (
                                                <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                                    Số khách

                                                    <Input
                                                        className="w-24"
                                                        type="number"
                                                        min={1}
                                                        max={room.capacity}
                                                        required
                                                        value={
                                                            roomGuests[
                                                                room.roomId
                                                            ] ?? 1
                                                        }
                                                        onChange={(event) =>
                                                            setRoomGuests(
                                                                (current) => ({
                                                                    ...current,
                                                                    [room.roomId]:
                                                                        Number(
                                                                            event.target.value,
                                                                        ),
                                                                }),
                                                            )
                                                        }
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </fieldset>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium">
                            Ngày giờ nhận phòng

                            <Input
                                type="datetime-local"
                                required
                                min={todayInput()}
                                value={checkIn}
                                onChange={(event) =>
                                    setCheckIn(event.target.value)
                                }
                            />
                        </label>

                        <label className="space-y-2 text-sm font-medium">
                            Ngày giờ trả phòng

                            <Input
                                type="datetime-local"
                                required
                                min={checkIn || todayInput()}
                                value={checkOut}
                                onChange={(event) =>
                                    setCheckOut(event.target.value)
                                }
                            />
                        </label>
                    </div>

                    <label className="block max-w-lg space-y-2 text-sm font-medium">
                        Gói dịch vụ (không bắt buộc)

                        <select
                            value={servicePackageId}
                            onChange={(event) =>
                                setServicePackageId(event.target.value)
                            }
                            className="h-11 w-full rounded-md border bg-background px-3"
                        >
                            <option value="">
                                Không chọn gói dịch vụ
                            </option>

                            {servicePackages.map((item) => (
                                <option
                                    key={item.servicePackageId}
                                    value={item.servicePackageId}
                                >
                                    {item.packageName} ·{" "}
                                    {item.packagePrice.toLocaleString("vi-VN")} VNĐ
                                </option>
                            ))}
                        </select>

                        {servicePackages.length === 0 && !packageError && (
                            <span className="block text-xs text-muted-foreground">
                                Hiện không có gói dịch vụ.
                            </span>
                        )}

                        {packageError && (
                            <span
                                role="status"
                                className="block text-xs text-amber-700"
                            >
                                Không thể tải danh sách gói dịch vụ (
                                {packageError}); bạn vẫn có thể gửi booking mà
                                không chọn gói.
                            </span>
                        )}
                    </label>

                    <label className="block space-y-2 text-sm font-medium">
                        Ghi chú (không bắt buộc)

                        <textarea
                            maxLength={500}
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />
                    </label>

                    <Button
                        type="submit"
                        disabled={
                            submitting ||
                            loading ||
                            rooms.length === 0 ||
                            selectedRoomIds.length === 0
                        }
                        className="w-full sm:w-auto"
                    >
                        {submitting
                            ? "Đang gửi yêu cầu…"
                            : "Gửi yêu cầu đặt phòng"}
                    </Button>
                </form>
            )}
        </div>
    );
}
