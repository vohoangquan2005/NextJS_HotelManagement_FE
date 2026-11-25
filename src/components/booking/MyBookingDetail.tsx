
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    CircleAlert,
    LoaderCircle,
} from "lucide-react";

import { getMyBookingDetail } from "@/app/api/booking.api";
import { createMyCancellation } from "@/app/api/cancellation.api";
import { useAuth } from "@/contexts/AuthContext";
import type { BookingResponseDto } from "@/types/booking";
import type { CancellationDto } from "@/types/cancellation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerBookingReviews } from "@/components/booking/CustomerBookingReviews";
import { ErrorAlertDialog } from "@/components/common/ErrorAlertDialog";
import { CustomerCheckInOut } from "@/components/booking/CustomerCheckInOut";

const statuses = [
    "Đang chờ xử lý",
    "Đã xác nhận",
    "Đã nhận phòng",
    "Hoàn thành",
    "Đã hủy",
    "Bị từ chối",
];

const money = (value: number) =>
    `${value.toLocaleString("vi-VN")} VNĐ`;

const formatDate = (value: string) =>
    new Date(value).toLocaleString("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
    });

export default function MyBookingDetail() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    const [booking, setBooking] =
        useState<BookingResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancelReason, setCancelReason] = useState("");
    const [cancellation, setCancellation] = useState<CancellationDto | null>(null);
    const [cancelError, setCancelError] = useState("");
    const [cancelLoading, setCancelLoading] = useState(false);

    async function requestCancellation() {
        if (!booking || !cancelReason.trim()) return;
        setCancelLoading(true);
        setCancelError("");
        try {
            setCancellation(await createMyCancellation({ bookingId: booking.bookingId, reason: cancelReason.trim() }));
        } catch (cause) {
            setCancelError(cause instanceof Error ? cause.message : "Không thể gửi yêu cầu hủy.");
        } finally {
            setCancelLoading(false);
        }
    }

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.replace(
                `/login?redirect=${encodeURIComponent(`/bookings/${id}`)}`
            );
            return;
        }

        if (user.roleName !== "Customer") return;

        const bookingId = Number(id);

        if (!Number.isInteger(bookingId) || bookingId <= 0) {
            queueMicrotask(() => {
                setError("Mã đặt phòng không hợp lệ.");
                setLoading(false);
            });
            return;
        }

        let active = true;

        void getMyBookingDetail(bookingId)
            .then((data) => {
                if (active) setBooking(data);
            })
            .catch((cause: unknown) => {
                if (active) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : "Không thể tải chi tiết đặt phòng."
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [authLoading, user, id, router]);

    if (
        authLoading ||
        !user ||
        (user.roleName === "Customer" && loading)
    ) {
        return (
            <div className="flex min-h-96 items-center justify-center gap-3 text-muted-foreground">
                <LoaderCircle className="size-5 animate-spin" />
                Đang tải thông tin đặt phòng…
            </div>
        );
    }

    if (user.roleName !== "Customer") {
        return (
            <div className="mx-auto max-w-xl px-4 py-16 text-center">
                Trang này dành cho khách hàng.
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
            <Link
                href="/bookings"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="size-4" />
                Đặt phòng của tôi
            </Link>

            {error || !booking ? (
                <div
                    role="alert"
                    className="mt-6 rounded-2xl border border-destructive/30 p-8 text-center"
                >
                    <CircleAlert className="mx-auto size-8 text-destructive" />

                    <p className="mt-3 text-sm text-destructive">
                        {error || "Không tìm thấy đặt phòng."}
                    </p>
                </div>
            ) : (
                <article className="mt-6 rounded-2xl border bg-card p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                                Chi tiết đặt phòng
                            </p>

                            <h1 className="mt-2 text-2xl font-bold">
                                #{booking.bookingId}
                            </h1>
                        </div>

                        <span className="rounded-full border bg-muted px-3 py-1 text-xs font-semibold">
                            {statuses[Number(booking.status)] ??
                                String(booking.status)}
                        </span>
                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Nhận phòng dự kiến
                            </p>

                            <p className="mt-1 font-medium">
                                {formatDate(booking.expectedCheckIn)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Trả phòng dự kiến
                            </p>

                            <p className="mt-1 font-medium">
                                {formatDate(booking.expectedCheckOut)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Số khách / phòng
                            </p>

                            <p className="mt-1 font-medium">
                                {booking.guestCount} khách / {booking.roomCount} phòng
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Ngày tạo đặt phòng
                            </p>

                            <p className="mt-1 font-medium">
                                {formatDate(booking.bookingDate)}
                            </p>
                        </div>
                    </div>

                    <h2 className="mt-8 border-b pb-3 font-semibold">
                        Phòng đã đặt
                    </h2>
                    <p className="mt-2 text-xs text-muted-foreground">
                        Check-in và check-out được thực hiện riêng theo trạng thái của từng phòng.
                    </p>

                    <div className="divide-y">
                        {booking.bookingDetails?.map((detail) => (
                            <div
                                key={detail.bookingDetailId}
                                className="flex flex-wrap justify-between gap-3 py-4"
                            >
                                <div>
                                    <p className="font-medium">
                                        {detail.roomName ||
                                            `Phòng #${detail.roomId}`}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {detail.roomTypeName || "Chưa có thông tin loại phòng"} · {detail.guestCount} khách
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Giá lưu tại thời điểm đặt: {money(detail.pricePerNight)} / đêm
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Check-in: {detail.actualCheckIn ? formatDate(detail.actualCheckIn) : "Chưa thực hiện"} · Check-out: {detail.actualCheckOut ? formatDate(detail.actualCheckOut) : "Chưa thực hiện"}
                                    </p>
                                </div>

                                <p className="font-medium">
                                    {money(detail.totalAmount)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <CustomerCheckInOut
                        booking={booking}
                        onBookingUpdated={setBooking}
                    />

                    <CustomerBookingReviews
                        bookingId={booking.bookingId}
                        bookingStatus={Number(booking.status)}
                        rooms={booking.bookingDetails?.map((detail) => ({
                            roomId: detail.roomId,
                            roomName: detail.roomName,
                        })) ?? []}
                    />

                    <h2 className="mt-8 border-b pb-3 font-semibold">
                        Dịch vụ đã đặt
                    </h2>

                    {booking.bookingServices?.length ? (
                        <div className="divide-y">
                            {booking.bookingServices.map((service) => (
                                <div
                                    key={service.bookingServiceId}
                                    className="flex flex-wrap justify-between gap-3 py-4 text-sm"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {service.serviceName ||
                                                `Dịch vụ #${service.serviceId}`}
                                        </p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Số lượng {service.quantity} · Đơn giá {money(service.unitPrice)}
                                        </p>
                                    </div>

                                    <p className="font-medium">
                                        {money(service.totalAmount)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="py-4 text-sm text-muted-foreground">
                            Booking này chưa có dịch vụ phát sinh.
                        </p>
                    )}

                    <h2 className="mt-6 border-b pb-3 font-semibold">
                        Tổng hợp chi phí
                    </h2>

                    <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Tiền phòng
                            </dt>

                            <dd>{money(booking.roomAmount)}</dd>
                        </div>

                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Gói dịch vụ
                                {booking.packageName
                                    ? ` · ${booking.packageName}`
                                    : ""}
                            </dt>

                            <dd>{money(booking.packageAmount)}</dd>
                        </div>

                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Dịch vụ phát sinh
                            </dt>

                            <dd>
                                {money(booking.additionalServiceAmount)}
                            </dd>
                        </div>

                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Giảm giá
                            </dt>

                            <dd>−{money(booking.discountAmount)}</dd>
                        </div>

                        <div className="flex justify-between border-t pt-3 text-base font-bold">
                            <dt>Tổng tiền</dt>

                            <dd>{money(booking.totalAmount)}</dd>
                        </div>

                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Tiền đặt cọc
                            </dt>

                            <dd>{money(booking.depositAmount)}</dd>
                        </div>
                    </dl>

                    {booking.note && (
                        <p className="mt-6 rounded-xl bg-muted/50 p-4 text-sm">
                            <strong>Ghi chú:</strong> {booking.note}
                        </p>
                    )}

                    {Number(booking.status) === 1 && !cancellation && (
                        <section className="mt-6 space-y-3 rounded-xl border p-4">
                            <h2 className="font-semibold">Yêu cầu hủy đặt phòng</h2>
                            
                            <Input value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} maxLength={500} placeholder="Lý do hủy" aria-label="Lý do hủy" />
                            <Button disabled={cancelLoading || !cancelReason.trim()} onClick={() => void requestCancellation()}>{cancelLoading ? "Đang gửi…" : "Gửi yêu cầu hủy"}</Button>
                        </section>
                    )}
                    {cancellation && <p role="status" className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">Yêu cầu hủy đang chờ nhân viên xử lý. Số tiền dự kiến hoàn theo chính sách: <strong>{money(cancellation.refundAmount)}</strong>.</p>}
                    {Number(booking.status) === 2 && <p className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">Nhân viên sẽ lập khoản thanh toán cuối sau khi hoàn tất checkout các phòng. Theo dõi khoản phải trả tại <Link href="/payments" className="font-medium underline">Thanh toán của tôi</Link>.</p>}
                </article>
            )}
            <ErrorAlertDialog message={cancelError} onClose={() => setCancelError("")} />
        </div>
    );
}
