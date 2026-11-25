
"use client";

import type { GuestDto } from "@/types/guest";

export function GuestDetail({
    guest,
    onClose,
}: {
    guest: GuestDto;
    onClose: () => void;
}) {
    return (
        <section className="rounded-xl border bg-card p-5 shadow-xl">
            <div className="flex justify-between">
                <h2 className="text-lg font-semibold">
                    Chi tiết khách #{guest.guestId}
                </h2>

                <button
                    className="text-sm text-muted-foreground"
                    type="button"
                    onClick={onClose}
                >
                    Đóng
                </button>
            </div>

            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div>Booking detail: #{guest.bookingDetailId}</div>
                <div>Họ tên: {guest.fullName || "—"}</div>
                <div>
                    Ngày sinh:{" "}
                    {guest.dateOfBirth
                        ? new Date(guest.dateOfBirth).toLocaleDateString("vi-VN")
                        : "—"}
                </div>
                <div>Giới tính: {guest.gender || "—"}</div>
                <div>Điện thoại: {guest.phoneNumber || "—"}</div>
                <div>Email: {guest.email || "—"}</div>
                <div>Quốc tịch: {guest.nationality || "—"}</div>
                <div>Ghi chú: {guest.note || "—"}</div>
            </dl>
        </section>
    );
}
