
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    LoaderCircle,
    RefreshCw,
    Search,
    UserPlus,
    Pencil,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    getGuest,
    getGuests,
    createGuest,
    updateGuest,
    deleteGuest,
} from "@/app/api/guest.api";
import { getBookings } from "@/app/api/booking.api";
import type { GuestDto, GuestWriteDto } from "@/types/guest";
import type { BookingResponseDto } from "@/types/booking";
import { GuestForm } from "@/components/guest/GuestForm";
import { GuestDetail } from "@/components/guest/GuestDetail";

const blank: GuestWriteDto = {
    bookingDetailId: 0,
    fullName: "",
    dateOfBirth: null,
    gender: "Nam",
    nationality: "Việt Nam",
    phoneNumber: "",
    email: "",
    note: "",
};

export default function GuestManagement() {
    const [items, setItems] = useState<GuestDto[]>([]);
    const [bookings, setBookings] = useState<BookingResponseDto[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [editing, setEditing] = useState<GuestDto | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [detail, setDetail] = useState<GuestDto | null>(null);

    const [form, setForm] = useState<GuestWriteDto>(blank);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getGuests();
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Không thể tải khách lưu trú.",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        getGuests()
            .then((data) => {
                if (active) setItems(Array.isArray(data) ? data : []);
            })
            .catch((e) => {
                if (active) {
                    setError(
                        e instanceof Error
                            ? e.message
                            : "Không thể tải khách lưu trú.",
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    // Lấy danh sách booking
    useEffect(() => {
        let active = true;
        getBookings()
            .then((data) => {
                if (active) setBookings(Array.isArray(data) ? data : []);
            })
            .catch((e) => {
                if (active) {
                    setError(
                        e instanceof Error
                            ? e.message
                            : "Không thể tải danh sách đặt phòng.",
                    );
                }
            })
            .finally(() => {
                if (active) setBookingsLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const rows = useMemo(() => {
        if (!Array.isArray(items)) return [];
        const q = query.trim().toLocaleLowerCase("vi");

        return items.filter((x) =>
            `${x.fullName ?? ""} ${x.email ?? ""} ${x.phoneNumber ?? ""} ${x.bookingDetailId ?? ""}`
                .toLocaleLowerCase("vi")
                .includes(q),
        );
    }, [items, query]);

    function openForm(item?: GuestDto) {
        setDetail(null);
        setShowForm(true);
        setEditing(item ?? null);

        setForm(
            item
                ? {
                    bookingDetailId: item.bookingDetailId,
                    fullName: item.fullName,
                    dateOfBirth: item.dateOfBirth,
                    gender: item.gender,
                    nationality: item.nationality,
                    phoneNumber: item.phoneNumber,
                    email: item.email,
                    note: item.note,
                }
                : { ...blank },
        );

        setError("");
        setNotice("");
    }

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError("");
        setNotice("");

        if (!form.bookingDetailId || Number(form.bookingDetailId) < 1) {
            setError("Vui lòng chọn Booking Detail ID!");
            setSaving(false);
            return;
        }

        if (!form.fullName?.trim()) {
            setError("Vui lòng nhập tên khách hàng!");
            setSaving(false);
            return;
        }

        try {
            const payload = {
                ...form,
                bookingDetailId: Number(form.bookingDetailId),
                fullName: form.fullName.trim(),
            };

            if (editing) await updateGuest(editing.guestId, payload);
            else await createGuest(payload);

            setNotice(
                editing
                    ? "Đã cập nhật khách lưu trú."
                    : "Đã thêm khách lưu trú.",
            );

            setEditing(null);
            setShowForm(false);

            await load();
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Không thể lưu khách lưu trú.",
            );
        } finally {
            setSaving(false);
        }
    }

    async function remove(item: GuestDto) {
        if (
            !window.confirm(
                `Xóa hồ sơ khách ${item.fullName || `#${item.guestId}`}?`,
            )
        ) {
            return;
        }

        try {
            await deleteGuest(item.guestId);
            setNotice("Đã xóa khách lưu trú.");
            await load();
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Không thể xóa khách lưu trú.",
            );
        }
    }

    async function showDetail(item: GuestDto) {
        try {
            setShowForm(false);
            setDetail(await getGuest(item.guestId));
            setError("");
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Không thể tải chi tiết khách.",
            );
        }
    }

    return (
        <section className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="mt-2 text-3xl font-bold">
                        Khách lưu trú
                    </h1>
                </div>

                <div className="flex gap-2">
                    <Button onClick={() => openForm()}>
                        <UserPlus className="mr-2 size-4" />
                        Thêm khách
                    </Button>
                    <Button
                        variant="outline"
                        disabled={loading}
                        onClick={() => void load()}
                    >
                        <RefreshCw className="mr-2 size-4" />
                        Làm mới
                    </Button>
                </div>
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

            <div className="relative max-w-lg">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    className="pl-9"
                    placeholder="Tìm tên, email, điện thoại hoặc booking detail ID"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex min-h-40 items-center justify-center gap-2 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải…
                </div>
            ) : error && items.length === 0 ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
                    <p className="font-semibold text-destructive">{error}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Không thể kết nối hoặc tải dữ liệu từ máy chủ.
                    </p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => void load()}
                    >
                        <RefreshCw className="mr-2 size-4" />
                        Thử lại
                    </Button>
                </div>
            ) : rows.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                    {query.trim()
                        ? `Không tìm thấy khách lưu trú phù hợp với từ khóa "${query.trim()}".`
                        : "Chưa có khách lưu trú nào trong hệ thống."}
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                {[
                                    "Khách",
                                    "Mã chi tiết đặt phòng",
                                    "Liên hệ",
                                    "Quốc tịch",
                                ].map((x) => (
                                    <th key={x} className="px-4 py-3">
                                        {x}
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-right">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {rows.map((x) => (
                                <tr key={x.guestId}>
                                    <td className="px-4 py-3">
                                        <button
                                            type="button"
                                            className="font-semibold text-primary underline-offset-4 hover:underline"
                                            onClick={() => void showDetail(x)}
                                        >
                                            {x.fullName || "—"}
                                        </button>

                                        <p className="text-xs text-muted-foreground">
                                            #{x.guestId}
                                        </p>
                                    </td>

                                    <td className="px-4 py-3">
                                        #{x.bookingDetailId}
                                    </td>

                                    <td className="px-4 py-3">
                                        {x.phoneNumber || "—"}

                                        <p className="text-xs text-muted-foreground">
                                            {x.email || "—"}
                                        </p>
                                    </td>

                                    <td className="px-4 py-3">
                                        {x.nationality || "—"}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openForm(x)}
                                        >
                                            <Pencil className="mr-1 size-3" />
                                            Sửa
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="ml-1 text-destructive text-red-600"
                                            onClick={() => void remove(x)}
                                        >
                                            <Trash2 className="size-4" />
                                            Xóa mềm
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal thêm / chỉnh sửa khách */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
                        <GuestForm
                            editing={editing}
                            form={form}
                            setForm={setForm}
                            saving={saving}
                            bookings={bookings}
                            bookingsLoading={bookingsLoading}
                            onSubmit={submit}
                            onClose={() => {
                                setEditing(null);
                                setForm({ ...blank });
                                setShowForm(false);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Modal chi tiết khách */}
            {detail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
                        <GuestDetail
                            guest={detail}
                            onClose={() => setDetail(null)}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
