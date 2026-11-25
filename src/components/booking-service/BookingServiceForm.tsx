"use client";

import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { ServiceResponseDto } from "@/types/service";
import type { BookingResponseDto } from "@/types/booking";

interface BookingServiceFormProps {
    bookingId: string;
    setBookingId: (value: string) => void;
    serviceId: string;
    setServiceId: (value: string) => void;
    quantity: number;
    setQuantity: (value: number) => void;
    bookings: BookingResponseDto[];
    services: ServiceResponseDto[];
    saving: boolean;
    loading: boolean;
    onSubmit: () => void;
    onClose: () => void;
}

export function BookingServiceForm({
    bookingId,
    setBookingId,
    serviceId,
    setServiceId,
    quantity,
    setQuantity,
    bookings,
    services,
    saving,
    loading,
    onSubmit,
    onClose,
}: BookingServiceFormProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-service-form-title"
                className="w-full max-w-xl rounded-xl border bg-background p-6 shadow-xl"
            >
                <div className="mb-5 flex items-center justify-between">
                    <h2
                        id="booking-service-form-title"
                        className="text-xl font-semibold"
                    >
                        Thêm dịch vụ đặt phòng
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md px-2 py-1 text-xl text-muted-foreground hover:bg-muted"
                        aria-label="Đóng form"
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSubmit();
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <label
                            htmlFor="bookingId"
                            className="text-sm font-medium"
                        >
                            Booking ID
                        </label>

                        <select
                            id="bookingId"
                            required
                            value={bookingId}
                            onChange={(event) => setBookingId(event.target.value)}
                            disabled={loading || saving}
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">-- Chọn đặt phòng --</option>

                            {bookings.map((booking) => (
                                <option
                                    key={booking.bookingId}
                                    value={booking.bookingId}
                                >
                                    Đặt phòng #{booking.bookingId}
                                    {" - "}
                                    {booking.fullName || "Chưa có tên khách"}
                                </option>
                            ))}
                        </select>

                        {!loading && bookings.length === 0 && (
                            <p className="text-xs text-muted-foreground">
                                Không có đặt phòng đang hoạt động.
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="serviceId"
                            className="text-sm font-medium"
                        >
                            Dịch vụ
                        </label>

                        <select
                            id="serviceId"
                            required
                            value={serviceId}
                            onChange={(event) => setServiceId(event.target.value)}
                            disabled={loading || saving}
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">-- Chọn dịch vụ --</option>

                            {services.map((service) => (
                                <option
                                    key={service.serviceId}
                                    value={service.serviceId}
                                >
                                    {service.serviceName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="quantity"
                            className="text-sm font-medium"
                        >
                            Số lượng
                        </label>

                        <Input
                            id="quantity"
                            required
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(event) =>
                                setQuantity(Number(event.target.value))
                            }
                            disabled={saving}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Đóng
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                saving ||
                                loading ||
                                !bookingId ||
                                !serviceId ||
                                quantity < 1
                            }
                        >
                            {saving && (
                                <LoaderCircle className="mr-2 size-4 animate-spin" />
                            )}
                            Thêm dịch vụ
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}