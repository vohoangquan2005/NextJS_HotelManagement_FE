
"use client";

import { useEffect, useMemo, useState } from "react";
import {
    CircleAlert,
    LoaderCircle,
    RefreshCw,
    Search,
    Users,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { getCustomerById, getCustomers } from "@/app/api/customer.api";
import type { CustomerResponseDto } from "@/types/customer";

export default function CustomerManagement() {
    const [customers, setCustomers] = useState<CustomerResponseDto[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [detail, setDetail] = useState<CustomerResponseDto | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    async function openDetail(customerId: number) {
        setDetailLoading(true);
        setError("");

        try {
            setDetail(await getCustomerById(customerId));
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể tải chi tiết khách hàng."
            );
        } finally {
            setDetailLoading(false);
        }
    }

    async function reload() {
        setLoading(true);
        setError("");

        try {
            const data = await getCustomers();
            setCustomers(Array.isArray(data) ? data : []);
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể tải khách hàng."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let active = true;

        void getCustomers()
            .then((data) => {
                if (active) {
                    setCustomers(Array.isArray(data) ? data : []);
                }
            })
            .catch((cause: unknown) => {
                if (active) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : "Không thể tải khách hàng."
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

    const visibleCustomers = useMemo(() => {
        if (!Array.isArray(customers)) return [];
        const query = search.trim().toLocaleLowerCase("vi");

        return customers.filter(
            (customer) =>
                !query ||
                `${customer.fullName ?? ""} ${customer.email ?? ""} ${
                    customer.phoneNumber ?? ""
                }`
                    .toLocaleLowerCase("vi")
                    .includes(query)
        );
    }, [customers, search]);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                    Danh mục khách hàng
                </p>
                <h1 className="mt-2 text-3xl font-bold">Khách hàng</h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative max-w-lg flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        className="pl-9"
                        placeholder="Tìm theo tên, email, số điện thoại"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <button
                    onClick={() => void reload()}
                    disabled={loading}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm disabled:opacity-50"
                >
                    <RefreshCw className="size-4" />
                    Làm mới
                </button>
            </div>

            {loading ? (
                <div className="flex min-h-48 items-center justify-center gap-3 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải khách hàng…
                </div>
            ) : error ? (
                <div
                    role="alert"
                    className="rounded-xl border border-destructive/30 p-6 text-sm text-destructive"
                >
                    <div className="flex items-center gap-2">
                        <CircleAlert className="size-5" />
                        {error}
                    </div>

                    <button
                        onClick={() => void reload()}
                        className="mt-4 rounded-md border px-3 py-2 text-foreground"
                    >
                        Thử lại
                    </button>
                </div>
            ) : visibleCustomers.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-10 text-center">
                    <Users className="mx-auto size-8 text-muted-foreground/60" />

                    <p className="mt-3 text-sm text-muted-foreground">
                        {customers.length
                            ? "Không có kết quả phù hợp."
                            : "Chưa có khách hàng."}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full min-w-[640px] text-left text-sm">
                        <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3">Khách hàng</th>
                                <th className="px-4 py-3">Liên hệ</th>
                                <th className="px-4 py-3">Quốc tịch</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {visibleCustomers.map((customer) => (
                                <tr
                                    key={customer.customerId}
                                    className="hover:bg-muted/30"
                                >
                                    <td className="px-4 py-3">
                                        <p className="font-medium">
                                            {customer.fullName || "Chưa cập nhật"}
                                        </p>

                                        <button
                                            type="button"
                                            className="mt-1 text-xs text-primary underline-offset-4 hover:underline"
                                            onClick={() =>
                                                void openDetail(customer.customerId)
                                            }
                                        >
                                            Xem chi tiết #{customer.customerId}
                                        </button>
                                    </td>

                                    <td className="px-4 py-3">
                                        <p>{customer.email || "—"}</p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {customer.phoneNumber || "Chưa có số điện thoại"}
                                        </p>
                                    </td>

                                    <td className="px-4 py-3">
                                        {customer.nationality || "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {detailLoading && (
                <p
                    role="status"
                    className="text-sm text-muted-foreground"
                >
                    Đang tải chi tiết khách hàng…
                </p>
            )}

            {detail && (
                <section className="rounded-xl border bg-card p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">
                                Chi tiết khách hàng
                            </p>

                            <h2 className="mt-1 text-xl font-semibold">
                                {detail.fullName || `Khách #${detail.customerId}`}
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="text-sm text-muted-foreground hover:text-foreground"
                            onClick={() => setDetail(null)}
                        >
                            Đóng
                        </button>
                    </div>

                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                            <dt className="text-muted-foreground">Email</dt>
                            <dd>{detail.email || "—"}</dd>
                        </div>

                        <div>
                            <dt className="text-muted-foreground">Điện thoại</dt>
                            <dd>{detail.phoneNumber || "—"}</dd>
                        </div>

                        <div>
                            <dt className="text-muted-foreground">CCCD</dt>
                            <dd>{detail.cccd || "—"}</dd>
                        </div>

                        <div>
                            <dt className="text-muted-foreground">Quốc tịch</dt>
                            <dd>{detail.nationality || "—"}</dd>
                        </div>

                        <div>
                            <dt className="text-muted-foreground">Giới tính</dt>
                            <dd>{detail.gender || "—"}</dd>
                        </div>

                        <div>
                            <dt className="text-muted-foreground">Ngày sinh</dt>
                            <dd>
                                {detail.dateOfBirth
                                    ? new Date(detail.dateOfBirth).toLocaleDateString("vi-VN")
                                    : "—"}
                            </dd>
                        </div>
                    </dl>
                </section>
            )}
        </div>
    );
}
