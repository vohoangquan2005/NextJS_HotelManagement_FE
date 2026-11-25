"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    LoaderCircle,
    Plus,
    RefreshCw,
    Search,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

import {
    getBookingServices,
    createBookingService,
    updateBookingService,
    deleteBookingService,
} from "@/app/api/booking-service.api";

import { getServices } from "@/app/api/service.api";
import { getBookings } from "@/app/api/booking.api";

import type { BookingServiceDto } from "@/types/booking-service";
import type { ServiceResponseDto } from "@/types/service";
import type { BookingResponseDto } from "@/types/booking";

import { BookingServiceForm } from "@/components/booking-service/BookingServiceForm";

export default function BookingServiceManagement() {
    const { user } = useAuth();

    const [items, setItems] = useState<BookingServiceDto[]>([]);
    const [services, setServices] = useState<ServiceResponseDto[]>([]);
    const [bookings, setBookings] = useState<BookingResponseDto[]>([]);

    const [bookingId, setBookingId] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [bookingServicesData, servicesData, bookingsData] =
                await Promise.all([
                    getBookingServices(),
                    getServices(),
                    getBookings(),
                ]);

            setItems(
                Array.isArray(bookingServicesData)
                    ? bookingServicesData
                    : [],
            );

            setServices(
                Array.isArray(servicesData)
                    ? servicesData
                    : [],
            );

            setBookings(
                Array.isArray(bookingsData)
                    ? bookingsData.filter((booking) =>
                        [0, 1, 2].includes(Number(booking.status)),
                    )
                    : [],
            );
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể tải dữ liệu.",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;

        Promise.all([
            getBookingServices(),
            getServices(),
            getBookings(),
        ])
            .then(([bookingServicesData, servicesData, bookingsData]) => {
                if (active) {
                    setItems(
                        Array.isArray(bookingServicesData)
                            ? bookingServicesData
                            : [],
                    );

                    setServices(
                        Array.isArray(servicesData)
                            ? servicesData
                            : [],
                    );

                    setBookings(
                        Array.isArray(bookingsData)
                            ? bookingsData.filter((booking) =>
                                [0, 1, 2].includes(Number(booking.status)),
                            )
                            : [],
                    );
                }
            })
            .catch((cause: unknown) => {
                if (active) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : "Không thể tải dữ liệu.",
                    );
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const filtered = useMemo(() => {
        const search = query.trim().toLocaleLowerCase("vi");

        return items.filter((item) => {
            const searchableText = [
                item.bookingId,
                item.serviceId,
                item.serviceName ?? "",
            ]
                .join(" ")
                .toLocaleLowerCase("vi");

            return !search || searchableText.includes(search);
        });
    }, [items, query]);

    async function submit() {
        if (!bookingId || !serviceId || quantity < 1) {
            return;
        }

        setSaving(true);
        setError("");
        setNotice("");

        try {
            await createBookingService({
                bookingId: Number(bookingId),
                serviceId: Number(serviceId),
                quantity,
            });

            setNotice("Thêm dịch vụ đặt phòng thành công.");

            setBookingId("");
            setServiceId("");
            setQuantity(1);
            setShowForm(false);

            await load();
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể thêm dịch vụ đặt phòng.",
            );
        } finally {
            setSaving(false);
        }
    }

    async function change(item: BookingServiceDto) {
        const value = window.prompt(
            "Nhập số lượng mới:",
            String(item.quantity),
        );

        if (value === null) {
            return;
        }

        const newQuantity = Number(value);

        if (!Number.isInteger(newQuantity) || newQuantity < 1) {
            window.alert("Số lượng phải là số nguyên lớn hơn 0.");
            return;
        }

        setError("");
        setNotice("");

        try {
            await updateBookingService(
                item.bookingServiceId,
                newQuantity,
            );

            setNotice("Cập nhật số lượng dịch vụ thành công.");

            await load();
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể cập nhật dịch vụ.",
            );
        }
    }

    async function remove(item: BookingServiceDto) {
        if (
            !window.confirm(
                `Bạn có chắc muốn xóa dịch vụ của đặt phòng #${item.bookingId}?`,
            )
        ) {
            return;
        }

        setError("");
        setNotice("");

        try {
            await deleteBookingService(item.bookingServiceId);

            setNotice("Xóa dịch vụ đặt phòng thành công.");

            await load();
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể xóa dịch vụ.",
            );
        }
    }

    function openForm() {
        setBookingId("");
        setServiceId("");
        setQuantity(1);
        setError("");
        setNotice("");
        setShowForm(true);
    }

    function closeForm() {
        if (saving) {
            return;
        }

        setShowForm(false);
    }

    const money = (value: number) =>
        `${value.toLocaleString("vi-VN")} VNĐ`;

    return (
        <section className="space-y-6">
            {/* Tiêu đề và thao tác */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Quản lý đặt dịch vụ
                    </h1>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        onClick={openForm}
                        disabled={loading}
                    >
                        <Plus className="mr-2 size-4" />
                        Thêm dịch vụ
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => void load()}
                        disabled={loading}
                    >
                        <RefreshCw className="mr-2 size-4" />
                        Làm mới
                    </Button>
                </div>
            </div>

            {/* Thông báo */}
            {notice && (
                <p
                    role="status"
                    className="rounded-lg border border-emerald-600/30 bg-emerald-600/5 p-3 text-sm text-emerald-700"
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

            {/* Tìm kiếm */}
            <div className="relative max-w-lg">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    className="pl-9"
                    placeholder="Tìm theo Booking ID, tên dịch vụ, Service ID"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>

            {/* Bảng dữ liệu */}
            {loading ? (
                <div className="flex min-h-48 items-center justify-center gap-3 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải dữ liệu…
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
                    {items.length
                        ? "Không có kết quả phù hợp."
                        : "Chưa có dịch vụ đặt phòng nào."}
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr className="border-b text-left">
                                <th className="p-4">Booking ID</th>
                                <th className="p-4">Service ID</th>
                                <th className="p-4">Tên dịch vụ</th>
                                <th className="p-4 text-center">Số lượng</th>
                                <th className="p-4 text-right">Đơn giá</th>
                                <th className="p-4 text-right">Thành tiền</th>
                                <th className="p-4 text-center">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((item) => (
                                <tr
                                    key={item.bookingServiceId}
                                    className="border-b last:border-0 hover:bg-muted/30"
                                >
                                    <td className="p-4">
                                        #{item.bookingId}
                                    </td>

                                    <td className="p-4">
                                        #{item.serviceId}
                                    </td>

                                    <td className="p-4 font-medium">
                                        {item.serviceName || "Không có tên"}
                                    </td>

                                    <td className="p-4 text-center">
                                        {item.quantity}
                                    </td>

                                    <td className="p-4 text-right">
                                        {money(item.unitPrice)}
                                    </td>

                                    <td className="p-4 text-right font-medium">
                                        {money(item.totalAmount)}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => void change(item)}
                                            >
                                                Sửa
                                            </Button>

                                            {user?.roleName === "Admin" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-destructive"
                                                    onClick={() => void remove(item)}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Form dạng modal nổi */}
            {showForm && (
                <BookingServiceForm
                    bookingId={bookingId}
                    setBookingId={setBookingId}
                    serviceId={serviceId}
                    setServiceId={setServiceId}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    bookings={bookings}
                    services={services}
                    saving={saving}
                    loading={loading}
                    onSubmit={submit}
                    onClose={closeForm}
                />
            )}
        </section>
    );
}