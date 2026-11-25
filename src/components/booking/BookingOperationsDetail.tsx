
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    Check,
    CircleAlert,
    LoaderCircle,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
    checkInBookingDetail,
    checkOutBookingDetail,
    getBookingById,
} from "@/app/api/booking.api";
import type { BookingResponseDto } from "@/types/booking";

const statuses = [
    "Đang chờ xử lý",
    "Đã xác nhận",
    "Đã nhận phòng",
    "Hoàn thành",
    "Đã hủy",
    "Bị từ chối",
];

const date = (value?: string | null) =>
    value
        ? new Date(value).toLocaleString("vi-VN", {
              dateStyle: "medium",
              timeStyle: "short",
          })
        : "Chưa thực hiện";

const money = (value: number) =>
    `${value.toLocaleString("vi-VN")} VNĐ`;

export default function BookingOperationsDetail() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();

    const [booking, setBooking] = useState<BookingResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [working, setWorking] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const load = useCallback(async () => {
        const bookingId = Number(id);

        if (!Number.isInteger(bookingId) || bookingId < 1) {
            queueMicrotask(() => {
                setError("Mã đặt phòng không hợp lệ.");
                setLoading(false);
            });
            return;
        }

        setLoading(true);
        setError("");

        try {
            setBooking(await getBookingById(bookingId));
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể tải chi tiết đặt phòng.",
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        let active = true;
        const bookingId = Number(id);

        if (!Number.isInteger(bookingId) || bookingId < 1) {
            queueMicrotask(() => {
                if (active) {
                    setError("Mã đặt phòng không hợp lệ.");
                    setLoading(false);
                }
            });
            return;
        }

        getBookingById(bookingId)
            .then((data) => {
                if (active) setBooking(data);
            })
            .catch((cause) => {
                if (active) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : "Không thể tải chi tiết đặt phòng.",
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [id]);

    async function runDetailAction(
        detailId: number,
        action: "checkin" | "checkout",
    ) {
        setWorking(detailId);
        setError("");
        setNotice("");

        try {
            if (action === "checkin") {
                await checkInBookingDetail(detailId);
            } else {
                await checkOutBookingDetail(detailId);
            }

            setNotice(
                action === "checkin"
                    ? "Đã ghi nhận check-in."
                    : "Đã ghi nhận check-out. Nếu đây là phòng cuối, khoản thanh toán cuối đã được tạo hoặc hóa đơn đã hoàn tất.",
            );

            await load();
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể cập nhật trạng thái phòng.",
            );
        } finally {
            setWorking(null);
        }
    }

    const base = user?.roleName === "Admin" ? "/admin" : "/staff";

    return (
        <section className="mx-auto max-w-5xl space-y-6">
            <Link
                href={`${base}/bookings`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="size-4" />
                Danh sách đặt phòng
            </Link>

            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Nghiệp vụ lưu trú
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">
                        Chi tiết đặt phòng{" "}
                        {booking ? `#${booking.bookingId}` : ""}
                    </h1>
                </div>

                <Button
                    variant="outline"
                    onClick={() => void load()}
                    disabled={loading}
                >
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
                    className="flex gap-2 rounded-lg border border-destructive/30 p-3 text-sm text-destructive"
                >
                    <CircleAlert className="size-4 shrink-0" />
                    {error}
                </p>
            )}

            {loading ? (
                <div className="flex min-h-48 items-center justify-center gap-2 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải…
                </div>
            ) : (
                booking && (
                    <>
                        <article className="rounded-xl border bg-card p-5">
                            <div className="flex flex-wrap justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {booking.fullName || "Khách hàng"}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {booking.email || "—"} ·{" "}
                                        {booking.phoneNumber || "—"}
                                    </p>
                                </div>

                                <span className="h-fit rounded-full border bg-muted px-3 py-1 text-xs">
                                    {statuses[Number(booking.status)] ??
                                        booking.status}
                                </span>
                            </div>

                            <div className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
                                <p>
                                    Nhận dự kiến
                                    <strong className="mt-1 block">
                                        {date(booking.expectedCheckIn)}
                                    </strong>
                                </p>

                                <p>
                                    Trả dự kiến
                                    <strong className="mt-1 block">
                                        {date(booking.expectedCheckOut)}
                                    </strong>
                                </p>

                                <p>
                                    Khách / phòng
                                    <strong className="mt-1 block">
                                        {booking.guestCount} khách /{" "}
                                        {booking.roomCount} phòng
                                    </strong>
                                </p>
                            </div>

                            {booking.note && (
                                <p className="mt-4 rounded-lg bg-muted/50 p-3 text-sm">
                                    Ghi chú: {booking.note}
                                </p>
                            )}
                        </article>

                        <section className="space-y-3">
                            <h2 className="text-lg font-semibold">
                                Phòng trong đặt phòng
                            </h2>

                            {booking.bookingDetails?.length ? (
                                booking.bookingDetails.map((detail) => (
                                    <article
                                        key={detail.bookingDetailId}
                                        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4"
                                    >
                                        <div>
                                            <h3 className="font-medium">
                                                {detail.roomName ||
                                                    `Phòng #${detail.roomId}`}
                                            </h3>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {detail.roomTypeName || "Chưa có thông tin loại phòng"} · {detail.guestCount} khách ·{" "}
                                                {money(detail.pricePerNight)} / đêm ·{" "}
                                                {money(detail.totalAmount)}
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Check-in:{" "}
                                                {date(detail.actualCheckIn)} ·
                                                Check-out:{" "}
                                                {date(detail.actualCheckOut)}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            {!detail.actualCheckIn &&
                                                [1, 2].includes(Number(booking.status)) && (
                                                    <Button
                                                        size="sm"
                                                        disabled={
                                                            working ===
                                                            detail.bookingDetailId
                                                        }
                                                        onClick={() =>
                                                            void runDetailAction(
                                                                detail.bookingDetailId,
                                                                "checkin",
                                                            )
                                                        }
                                                    >
                                                        <Check className="mr-1 size-4" />
                                                        Check-in
                                                    </Button>
                                                )}

                                            {detail.actualCheckIn &&
                                                !detail.actualCheckOut &&
                                                Number(booking.status) === 2 && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={
                                                            working ===
                                                            detail.bookingDetailId
                                                        }
                                                        onClick={() =>
                                                            void runDetailAction(
                                                                detail.bookingDetailId,
                                                                "checkout",
                                                            )
                                                        }
                                                    >
                                                        <Check className="mr-1 size-4" />
                                                        Check-out
                                                    </Button>
                                                )}
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                    Không có chi tiết phòng.
                                </p>
                            )}
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-semibold">
                                Dịch vụ đã đặt
                            </h2>

                            {booking.bookingServices?.length ? (
                                <div className="divide-y rounded-xl border bg-card px-4">
                                    {booking.bookingServices.map((service) => (
                                        <div
                                            key={service.bookingServiceId}
                                            className="flex justify-between gap-3 py-3 text-sm"
                                        >
                                            <span>
                                                {service.serviceName ||
                                                    `Dịch vụ #${service.serviceId}`}{" "}
                                                × {service.quantity}
                                            </span>

                                            <span>
                                                {money(service.totalAmount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                    Chưa có dịch vụ gắn với đặt phòng này.
                                </p>
                            )}
                        </section>
                    </>
                )
            )}
        </section>
    );
}
