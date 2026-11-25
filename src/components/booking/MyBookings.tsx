
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    CalendarDays,
    CalendarCheck,
    CircleAlert,
    LoaderCircle,
    RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getMyBookings } from "@/app/api/booking.api";
import { useAuth } from "@/contexts/AuthContext";
import type { BookingResponseDto } from "@/types/booking";

const statusLabels = [
    "Đang chờ xử lý",
    "Đã xác nhận",
    "Đã nhận phòng",
    "Hoàn thành",
    "Đã hủy",
    "Bị từ chối",
];

function date(value: string) {
    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime())
        ? "—"
        : parsed.toLocaleString("vi-VN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
}

export default function MyBookings() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    const [bookings, setBookings] = useState<BookingResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            setBookings(await getMyBookings());
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể tải đặt phòng.",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.replace("/login?redirect=%2Fbookings");
            return;
        }

        if (user.roleName !== "Customer") return;

        void Promise.resolve().then(load);
    }, [authLoading, user, router, load]);

    if (authLoading || !user) {
        return (
            <div className="flex min-h-96 items-center justify-center gap-3 text-muted-foreground">
                <LoaderCircle className="size-5 animate-spin" />
                Đang kiểm tra tài khoản…
            </div>
        );
    }

    if (user.roleName !== "Customer") {
        return (
            <div className="mx-auto max-w-xl px-4 py-16 text-center">
                <h1 className="text-xl font-semibold">
                    Trang này dành cho khách hàng
                </h1>

                <Link
                    className="mt-4 inline-block text-primary underline"
                    href="/"
                >
                    Về trang chủ
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Tài khoản khách hàng
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Đặt phòng của tôi
                    </h1>
                </div>

                <Link
                    href="/booking"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                >
                    Đặt phòng
                </Link>
            </div>

            {loading ? (
                <div className="flex min-h-48 items-center justify-center gap-3 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải đặt phòng…
                </div>
            ) : error ? (
                <div
                    role="alert"
                    className="rounded-2xl border border-destructive/30 p-8 text-center"
                >
                    <CircleAlert className="mx-auto size-8 text-destructive" />

                    <p className="mt-3 text-sm text-destructive">{error}</p>

                    <button
                        onClick={() => void load()}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
                    >
                        <RefreshCw className="size-4" />
                        Thử lại
                    </button>
                </div>
            ) : bookings.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-12 text-center">
                    <CalendarCheck className="mx-auto size-10 text-muted-foreground/50" />

                    <h2 className="mt-4 font-semibold">
                        Bạn chưa có đặt phòng
                    </h2>

                    <Link
                        href="/rooms"
                        className="mt-4 inline-block text-sm font-medium text-primary underline"
                    >
                        Khám phá phòng
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <article
                            key={booking.bookingId}
                            className="rounded-2xl border bg-card p-5 sm:p-6"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                                <div className="flex items-center gap-2">
                                    <CalendarCheck className="size-5 text-primary" />

                                    <h2 className="font-semibold">
                                        Đặt phòng #{booking.bookingId}
                                    </h2>
                                </div>

                                <span className="rounded-full border bg-muted px-3 py-1 text-xs font-semibold">
                                    {statusLabels[Number(booking.status)] ??
                                        `Trạng thái ${booking.status}`}
                                </span>
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Thời gian lưu trú
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {date(booking.expectedCheckIn)} –{" "}
                                        {date(booking.expectedCheckOut)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Số khách · số phòng
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {booking.guestCount} khách · {booking.roomCount} phòng
                                    </p>
                                </div>
                            </div>

                            {booking.bookingDetails?.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {booking.bookingDetails.map((detail) => (
                                        <span
                                            key={detail.bookingDetailId}
                                            className="rounded-lg bg-muted px-3 py-1.5 text-sm"
                                        >
                                            {detail.roomName || `Phòng #${detail.roomId}`}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="mt-5 grid gap-3 rounded-xl bg-muted/40 p-4 text-sm sm:grid-cols-3">
                                <p>
                                    Tiền phòng:{" "}
                                    <strong>
                                        {booking.roomAmount.toLocaleString("vi-VN")} VNĐ
                                    </strong>
                                </p>

                                <p>
                                    Đặt cọc:{" "}
                                    <strong>
                                        {booking.depositAmount.toLocaleString("vi-VN")} VNĐ
                                    </strong>
                                </p>

                                <p>
                                    Tổng tiền:{" "}
                                    <strong>
                                        {booking.totalAmount.toLocaleString("vi-VN")} VNĐ
                                    </strong>
                                </p>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <CalendarDays className="size-4" />
                                    Đặt lúc {date(booking.bookingDate)}
                                </div>

                                <Link
                                    href={`/bookings/${booking.bookingId}`}
                                    className="text-sm font-medium text-primary underline"
                                >
                                    Xem chi tiết
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
