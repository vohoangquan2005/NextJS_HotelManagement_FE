"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    CircleAlert,
    LoaderCircle,
    RefreshCw,
    Search,
    Trash2,
    Undo2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
    confirmBooking,
    rejectBooking,
    getBookings,
    getDeletedBookings,
    restoreBooking,
    softDeleteBooking,
} from "@/app/api/booking.api";
import type { BookingResponseDto } from "@/types/booking";

const PAGE_SIZE = 10;

const statusLabels = ["Đang chờ xử lý", "Đã xác nhận", "Đã nhận phòng", "Hoàn thành", "Đã hủy", "Bị từ chối"];

const date = (value: string) =>
    new Date(value).toLocaleString("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
    });

const money = (value: number) => `${value.toLocaleString("vi-VN")} VNĐ`;

type BookingAction = "confirm" | "reject" | "delete" | "restore";

export default function BookingManagement({ title = "Quản lý đặt phòng" }: { title?: string }) {
    const { user } = useAuth();

    const [items, setItems] = useState<BookingResponseDto[]>([]);
    const [deleted, setDeleted] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [workingId, setWorkingId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const load = useCallback(async (includeDeleted: boolean) => {
        setLoading(true);
        setError("");

        try {
            const data = includeDeleted ? await getDeletedBookings() : await getBookings();

            setItems(Array.isArray(data) ? data : []);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Không thể tải danh sách đặt phòng.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;

        void getBookings()
            .then((data) => {
                if (active) {
                    setItems(Array.isArray(data) ? data : []);
                }
            })
            .catch((cause: unknown) => {
                if (active) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : "Không thể tải danh sách đặt phòng.",
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
        if (!Array.isArray(items)) return [];
        const query = search.trim().toLocaleLowerCase("vi");

        return items.filter((item) => {
            const searchableText = [
                item.bookingId,
                item.fullName ?? "",
                item.email ?? "",
                item.phoneNumber ?? "",
            ]
                .join(" ")
                .toLocaleLowerCase("vi");

            return !query || searchableText.includes(query);
        });
    }, [items, search]);

    const pages = Math.ceil(filtered.length / PAGE_SIZE);

    const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    async function runAction(item: BookingResponseDto, action: BookingAction) {
        const labels: Record<BookingAction, string> = {
            confirm: "xác nhận đặt phòng",
            reject: "từ chối đặt phòng",
            delete: "xóa mềm đặt phòng",
            restore: "khôi phục đặt phòng",
        };

        if (!window.confirm(`Bạn có chắc muốn ${labels[action]} #${item.bookingId}?`)) {
            return;
        }

        setWorkingId(item.bookingId);
        setError("");
        setNotice("");

        try {
            if (action === "confirm") {
                await confirmBooking(item.bookingId);
            }
            if (action === "reject") await rejectBooking(item.bookingId);

            if (action === "delete") {
                await softDeleteBooking(item.bookingId);
            }

            if (action === "restore") {
                await restoreBooking(item.bookingId);
            }

            const actionMessages: Record<BookingAction, string> = {
                confirm: "xác nhận",
                reject: "từ chối",
                delete: "xóa mềm",
                restore: "khôi phục",
            };

            setNotice(`Đã ${actionMessages[action]} đặt phòng #${item.bookingId}.`);

            await load(deleted);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : `Không thể ${labels[action]}.`);
        } finally {
            setWorkingId(null);
        }
    }

    function toggleDeletedBookings() {
        const next = !deleted;

        setDeleted(next);
        setPage(1);
        setSearch("");

        void load(next);
    }

    return (
        <section className="space-y-6">
            {/* Tiêu đề và các thao tác */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="mt-2 text-3xl font-bold">
                        {deleted ? "Đặt phòng đã xóa" : title}
                    </h1>
                </div>

                <div className="flex flex-wrap gap-2">
                    {user?.roleName === "Admin" && (
                        <button
                            onClick={toggleDeletedBookings}
                            className="h-10 rounded-md border px-4 text-sm"
                        >
                            {deleted ? "Đặt phòng đang hoạt động" : "Đặt phòng đã xóa"}
                        </button>
                    )}

                    <button
                        onClick={() => void load(deleted)}
                        disabled={loading}
                        className="inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm disabled:opacity-50"
                    >
                        <RefreshCw className="size-4" />
                        Làm mới
                    </button>
                </div>
            </div>

            {/* Thông báo thành công */}
            {notice && (
                <p
                    role="status"
                    className="rounded-lg border border-emerald-600/30 bg-emerald-600/5 p-3 text-sm text-emerald-700"
                >
                    {notice}
                </p>
            )}

            {/* Thông báo lỗi */}
            {error && (
                <p
                    role="alert"
                    className="flex items-center gap-2 rounded-lg border border-destructive/30 p-3 text-sm text-destructive"
                >
                    <CircleAlert className="size-4 shrink-0" />
                    {error}
                </p>
            )}

            {/* Tìm kiếm */}
            <div className="relative max-w-lg">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    className="pl-9"
                    placeholder="Tìm mã đặt phòng, khách hàng, email, số điện thoại"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                    }}
                />
            </div>

            {/* Danh sách đặt phòng */}
            {loading ? (
                <div className="flex min-h-48 items-center justify-center gap-3 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải đặt phòng…
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
                    {items.length
                        ? "Không có kết quả phù hợp."
                        : "Không có đặt phòng trong danh sách này."}
                </div>
            ) : (
                <div className="space-y-3">
                    {visible.map((item) => (
                        <article
                            key={item.bookingId}
                            className="rounded-xl border bg-card p-4 sm:p-5"
                        >
                            {/* Thông tin khách hàng và trạng thái */}
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Link
                                            className="font-semibold text-primary underline-offset-4 hover:underline"
                                            href={`${
                                                user?.roleName === "Admin" ? "/admin" : "/staff"
                                            }/bookings/${item.bookingId}`}
                                        >
                                            Đặt phòng #{item.bookingId}
                                        </Link>

                                        <span className="rounded-full border bg-muted px-2.5 py-1 text-xs">
                                            {statusLabels[Number(item.status)] ??
                                                String(item.status)}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-sm">
                                        {item.fullName || "Chưa có tên"}

                                        <span className="text-muted-foreground">
                                            {" · "}
                                            {item.email ||
                                                item.phoneNumber ||
                                                "Chưa có thông tin liên hệ"}
                                        </span>
                                    </p>
                                </div>

                                <p className="font-semibold">{money(item.totalAmount)}</p>
                            </div>

                            {/* Thời gian và số lượng */}
                            <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                                <p>Nhận: {date(item.expectedCheckIn)}</p>

                                <p>Trả: {date(item.expectedCheckOut)}</p>

                                <p>
                                    {item.guestCount} khách · {item.roomCount} phòng
                                </p>
                            </div>

                            {/* Chi tiết phòng */}
                            {item.bookingDetails?.length > 0 && (
                                <details className="mt-4 rounded-lg bg-muted/40 px-3">
                                    <summary className="cursor-pointer py-3 text-sm font-medium">
                                        Chi tiết phòng ({item.bookingDetails.length})
                                    </summary>

                                    <div className="space-y-2 border-t py-3 text-sm">
                                        {item.bookingDetails.map((detail) => (
                                            <div
                                                key={detail.bookingDetailId}
                                                className="flex justify-between gap-2"
                                            >
                                                <span>
                                                    {detail.roomName || `Phòng #${detail.roomId}`}
                                                    {" · "}
                                                    {detail.guestCount} khách
                                                </span>

                                                <span>{money(detail.totalAmount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            )}

                            {/* Các thao tác theo trạng thái */}
                            <div className="mt-4 flex flex-wrap justify-end gap-2">
                                {deleted ? (
                                    user?.roleName === "Admin" && (
                                        <button
                                            disabled={workingId === item.bookingId}
                                            onClick={() => void runAction(item, "restore")}
                                            className="inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs disabled:opacity-50"
                                        >
                                            <Undo2 className="size-3.5" />
                                            Khôi phục
                                        </button>
                                    )
                                ) : (
                                    <>
                                        {Number(item.status) === 0 && (
                                            <button
                                                disabled={workingId === item.bookingId}
                                                onClick={() => void runAction(item, "confirm")}
                                                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground disabled:opacity-50"
                                            >
                                                <Check className="size-3.5" />
                                                Xác nhận
                                            </button>
                                        )}
                                        {Number(item.status) === 0 && <button disabled={workingId === item.bookingId} onClick={() => void runAction(item, "reject")} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-destructive/40 px-3 text-xs text-destructive disabled:opacity-50">Từ chối</button>}

                                        <button
                                            disabled={workingId === item.bookingId}
                                            onClick={() => void runAction(item, "delete")}
                                            className="inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs text-destructive disabled:opacity-50"
                                        >
                                            <Trash2 className="size-3.5" />
                                            Xóa mềm
                                        </button>
                                    </>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Phân trang */}
            {pages > 1 && (
                <nav
                    aria-label="Phân trang đặt phòng"
                    className="flex items-center justify-center gap-3"
                >
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                        className="rounded-md border p-2 disabled:opacity-40"
                        aria-label="Trang trước"
                    >
                        <ChevronLeft className="size-4" />
                    </button>

                    <span className="text-sm">
                        Trang {page} / {pages}
                    </span>

                    <button
                        disabled={page >= pages}
                        onClick={() => setPage(page + 1)}
                        className="rounded-md border p-2 disabled:opacity-40"
                        aria-label="Trang sau"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </nav>
            )}
        </section>
    );
}
