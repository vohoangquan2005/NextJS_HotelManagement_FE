"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GuestDto, GuestWriteDto } from "@/types/guest";
import type { BookingResponseDto } from "@/types/booking";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function GuestForm({
    editing,
    form,
    setForm,
    saving,
    bookings,
    bookingsLoading,
    onSubmit,
    onClose,
}: {
    editing: GuestDto | null;
    form: GuestWriteDto;
    setForm: (value: GuestWriteDto) => void;
    saving: boolean;
    bookings: BookingResponseDto[];
    bookingsLoading: boolean;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onClose: () => void;
}) {
    const [keyword, setKeyword] = useState("");
    const [open, setOpen] = useState(false);

    // Lấy danh sách BookingDetail từ các Booking
    const bookingDetails = useMemo(() => {
        return (Array.isArray(bookings) ? bookings : []).flatMap((booking) =>
            (booking?.bookingDetails ?? []).map((detail) => ({
                bookingId: booking.bookingId,
                bookingDetailId: detail.bookingDetailId,
                fullName: booking.fullName ?? "",
                phoneNumber: booking.phoneNumber ?? "",
                roomName: detail.roomName ?? "",
            })),
        );
    }, [bookings]);

    // BookingDetail đang được chọn
    const selected = bookingDetails.find(
        (item) => item.bookingDetailId === form.bookingDetailId,
    );

    // Tìm kiếm BookingDetail
    const filteredBookings = bookingDetails.filter((item) => {
        const search = keyword.trim().toLocaleLowerCase("vi");

        return [
            item.bookingId,
            item.bookingDetailId,
            item.fullName,
            item.phoneNumber,
            item.roomName,
        ]
            .join(" ")
            .toLocaleLowerCase("vi")
            .includes(search);
    });

    // Chọn BookingDetail
    function selectBooking(bookingDetailId: number) {
        setForm({
            ...form,
            bookingDetailId,
        });

        setOpen(false);
        setKeyword("");
    }

    return (
        <form
            onSubmit={onSubmit}
            className="grid gap-3 rounded-xl border bg-card p-4 shadow-xl sm:grid-cols-2"
        >
            <h2 className="font-semibold sm:col-span-2">
                {editing
                    ? `Sửa khách #${editing.guestId}`
                    : "Thông tin khách lưu trú"}
            </h2>

            {/* BookingDetailID Combobox */}
            <div className="relative space-y-1 text-sm sm:col-span-2">
                <label className="font-medium">
                    Booking Detail ID
                </label>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        className="pl-9 pr-9"
                        placeholder={
                            bookingsLoading
                                ? "Đang tải danh sách..."
                                : "Tìm BookingDetailID, BookingID, tên khách hoặc phòng..."
                        }
                        value={
                            open
                                ? keyword
                                : selected
                                    ? `${selected.bookingDetailId}`
                                    : ""
                        }
                        disabled={saving || bookingsLoading}
                        onFocus={() => {
                            setKeyword("");
                            setOpen(true);
                        }}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setOpen(true);
                        }}
                        onBlur={() => {
                            setTimeout(() => setOpen(false), 150);
                        }}
                    />

                    <ChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                {open && (
                    <div className="absolute left-0 top-full z-[60] mt-1 max-h-64 w-full overflow-y-auto rounded-lg border bg-popover shadow-lg">
                        {filteredBookings.length === 0 ? (
                            <p className="p-3 text-center text-muted-foreground">
                                Không tìm thấy BookingDetailID phù hợp.
                            </p>
                        ) : (
                            filteredBookings.map((item) => (
                                <button
                                    key={item.bookingDetailId}
                                    type="button"
                                    className="flex w-full items-center justify-between gap-3 border-b p-3 text-left last:border-0 hover:bg-accent"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() =>
                                        selectBooking(item.bookingDetailId)
                                    }
                                >
                                    <div className="min-w-0 space-y-1">
                                        <p className="font-semibold">
                                            BookingDetailID: #{item.bookingDetailId}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            BookingID: #{item.bookingId}
                                            {" · "}
                                            Phòng: {item.roomName || "—"}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {item.fullName || "Chưa có tên khách"}
                                            {" · "}
                                            SĐT: {item.phoneNumber || "—"}
                                        </p>
                                    </div>

                                    {form.bookingDetailId === item.bookingDetailId && (
                                        <Check className="size-4 shrink-0 text-primary" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                )}

                <p className="text-xs text-muted-foreground">
                    {selected
                        ? `Đã chọn BookingDetailID: #${selected.bookingDetailId}`
                        : "Vui lòng tìm kiếm và chọn BookingDetailID."}
                </p>
            </div>

            <label className="space-y-1 text-sm">
                Họ tên
                <Input
                    maxLength={100}
                    required
                    value={form.fullName ?? ""}
                    onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                    }
                />
            </label>

            <label className="space-y-1 text-sm">
                Ngày sinh
                <Input
                    type="date"
                    value={form.dateOfBirth?.slice(0, 10) ?? ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            dateOfBirth: e.target.value || null,
                        })
                    }
                />
            </label>

            <label className="space-y-1 text-sm">
                Giới tính

                <Select
                    value={form.gender || "Nam"}
                    onValueChange={(value) =>
                        setForm({ ...form, gender: value })
                    }
                    disabled={saving}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                </Select>
            </label>

            <label className="space-y-1 text-sm">
                Quốc tịch
                <Input
                    maxLength={50}
                    value={form.nationality ?? ""}
                    onChange={(e) =>
                        setForm({ ...form, nationality: e.target.value })
                    }
                />
            </label>

            <label className="space-y-1 text-sm">
                Số điện thoại
                <Input
                    maxLength={10}
                    value={form.phoneNumber ?? ""}
                    onChange={(e) =>
                        setForm({ ...form, phoneNumber: e.target.value })
                    }
                />
            </label>

            <label className="space-y-1 text-sm">
                Email
                <Input
                    type="email"
                    maxLength={100}
                    value={form.email ?? ""}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />
            </label>

            <label className="space-y-1 text-sm sm:col-span-2">
                Ghi chú
                <textarea
                    className="min-h-20 w-full rounded-md border bg-background px-3 py-2"
                    value={form.note ?? ""}
                    onChange={(e) =>
                        setForm({ ...form, note: e.target.value })
                    }
                />
            </label>

            <div className="flex justify-end gap-2 sm:col-span-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    disabled={
                        saving ||
                        bookingsLoading ||
                        !form.bookingDetailId ||
                        form.bookingDetailId <= 0
                    }
                >
                    {saving ? "Đang lưu…" : "Lưu"}
                </Button>
            </div>
        </form>
    );
}
