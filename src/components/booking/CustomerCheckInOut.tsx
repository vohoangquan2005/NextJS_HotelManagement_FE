"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { checkInBookingDetail, checkOutBookingDetail, getMyBookingDetail } from "@/app/api/booking.api";
import { ErrorAlertDialog } from "@/components/common/ErrorAlertDialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { BookingResponseDto } from "@/types/booking";

const formatDate = (value: string | null) => value
    ? new Date(value).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })
    : "Chưa thực hiện";

export function CustomerCheckInOut({
    booking,
    onBookingUpdated,
}: {
    booking: BookingResponseDto;
    onBookingUpdated: (booking: BookingResponseDto) => void;
}) {
    const bookingStatus = Number(booking.status);
    const [open, setOpen] = useState(false);
    const [workingId, setWorkingId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const hasAvailableAction = booking.bookingDetails.some((detail) =>
        (bookingStatus === 1 || bookingStatus === 2) &&
        (!detail.actualCheckIn || (detail.actualCheckIn && !detail.actualCheckOut)),
    );

    async function runAction(detailId: number, action: "checkin" | "checkout") {
        setWorkingId(detailId);
        setError("");
        setNotice("");
        try {
            if (action === "checkin") await checkInBookingDetail(detailId);
            else await checkOutBookingDetail(detailId);

            setNotice(action === "checkin"
                ? "Đã ghi nhận check-in cho phòng."
                : "Đã ghi nhận check-out cho phòng.");

            try {
                onBookingUpdated(await getMyBookingDetail(booking.bookingId));
            } catch (cause) {
                setError(cause instanceof Error
                    ? `Thao tác đã được ghi nhận nhưng không tải lại được booking: ${cause.message}`
                    : "Thao tác đã được ghi nhận nhưng không tải lại được booking.");
            }
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Không thể cập nhật trạng thái phòng.");
        } finally {
            setWorkingId(null);
        }
    }

    if (!hasAvailableAction) return null;

    return (
        <>
            <Button className="mt-5" onClick={() => setOpen(true)}>
                Check-in / Check-out
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Check-in / Check-out · Booking #{booking.bookingId}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        {booking.bookingDetails.map((detail) => {
                            const canCheckIn = (bookingStatus === 1 || bookingStatus === 2) && !detail.actualCheckIn;
                            const canCheckOut = bookingStatus === 2 && Boolean(detail.actualCheckIn) && !detail.actualCheckOut;
                            return (
                                <article key={detail.bookingDetailId} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
                                    <div>
                                        <h3 className="font-medium">{detail.roomName || `Phòng #${detail.roomId}`}</h3>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {detail.roomTypeName || "Chưa có thông tin loại phòng"} · {detail.guestCount} khách
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Check-in: {formatDate(detail.actualCheckIn)} · Check-out: {formatDate(detail.actualCheckOut)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {canCheckIn && <Button size="sm" disabled={workingId !== null} onClick={() => void runAction(detail.bookingDetailId, "checkin")}>
                                            <Check className="mr-1 size-4" />{workingId === detail.bookingDetailId ? "Đang xử lý…" : "Check-in"}
                                        </Button>}
                                        {canCheckOut && <Button size="sm" variant="outline" disabled={workingId !== null} onClick={() => void runAction(detail.bookingDetailId, "checkout")}>
                                            <Check className="mr-1 size-4" />{workingId === detail.bookingDetailId ? "Đang xử lý…" : "Check-out"}
                                        </Button>}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                    {notice && <p role="status" className="rounded-lg border border-emerald-600/30 p-3 text-sm text-emerald-700">{notice}</p>}
                </DialogContent>
            </Dialog>
            <ErrorAlertDialog message={error} onClose={() => setError("")} />
        </>
    );
}
