"use client";

import { useState, type FormEvent } from "react";
import {
    BarChart3,
    CircleAlert,
    LoaderCircle,
    Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    getOccupancyByDateRange,
    getRevenueByDateRange,
} from "@/app/api/statistics.api";

import type {
    OccupancyDailyStatisticsDto,
    RevenueDailyStatisticsDto,
} from "@/types/statistics";

function initialRange() {
    const now = new Date();
    const local = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000,
    );

    const endDate = local.toISOString().slice(0, 10);
    const first = new Date(local.getFullYear(), local.getMonth(), 1);

    return {
        startDate: new Date(
            first.getTime() - first.getTimezoneOffset() * 60000,
        )
            .toISOString()
            .slice(0, 10),
        endDate,
    };
}

export default function StatisticsManagement() {
    const [range, setRange] = useState(initialRange);
    const [revenue, setRevenue] = useState<RevenueDailyStatisticsDto[]>([]);
    const [occupancy, setOccupancy] = useState<OccupancyDailyStatisticsDto[]>(
        [],
    );
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (range.startDate > range.endDate) {
            setError("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
            return;
        }

        setLoading(true);

        try {
            const [revenueData, occupancyData] = await Promise.all([
                getRevenueByDateRange(range.startDate, range.endDate),
                getOccupancyByDateRange(range.startDate, range.endDate),
            ]);

            setRevenue(revenueData);
            setOccupancy(occupancyData);
            setLoaded(true);
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể tải số liệu thống kê.",
            );
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString("vi-VN");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="mt-2 text-3xl font-bold">
                    Báo cáo thống kê
                </h1>
            </div>

            <form
                onSubmit={submit}
                className="grid gap-4 rounded-2xl border bg-card p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
            >
                <label className="space-y-1.5 text-sm font-medium">
                    Từ ngày
                    <Input
                        type="date"
                        required
                        value={range.startDate}
                        onChange={(event) =>
                            setRange({ ...range, startDate: event.target.value })
                        }
                    />
                </label>

                <label className="space-y-1.5 text-sm font-medium">
                    Đến ngày
                    <Input
                        type="date"
                        required
                        value={range.endDate}
                        onChange={(event) =>
                            setRange({ ...range, endDate: event.target.value })
                        }
                    />
                </label>

                <Button disabled={loading} type="submit">
                    <Search className="mr-2 size-4" />
                    {loading ? "Đang tải…" : "Xem báo cáo"}
                </Button>
            </form>

            {error && (
                <p
                    role="alert"
                    className="flex items-center gap-2 rounded-xl border border-destructive/30 p-4 text-sm text-destructive"
                >
                    <CircleAlert className="size-5" />
                    {error}
                </p>
            )}

            {loading ? (
                <div className="flex min-h-48 items-center justify-center gap-3 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải dữ liệu ...
                </div>
            ) : !loaded ? (
                <div className="rounded-2xl border border-dashed p-10 text-center">
                    <BarChart3 className="mx-auto size-9 text-muted-foreground/60" />

                    <p className="mt-3 text-sm text-muted-foreground">
                        Chọn khoảng ngày để xem báo cáo.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid gap-6 xl:grid-cols-2">
                        <section className="overflow-hidden rounded-xl border bg-card">
                            <div className="border-b p-4">
                                <h2 className="font-semibold">
                                    Doanh thu theo ngày
                                </h2>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {formatDate(range.startDate)} –{" "}
                                    {formatDate(range.endDate)}
                                </p>
                            </div>

                            <div className="max-h-[480px] overflow-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="sticky top-0 bg-muted text-xs text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3">Ngày</th>
                                            <th className="px-4 py-3 text-right">
                                                Giao dịch
                                            </th>
                                            <th className="px-4 py-3 text-right">
                                                Doanh thu
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y">
                                        {revenue.map((item) => (
                                            <tr key={item.date}>
                                                <td className="px-4 py-3">
                                                    {formatDate(item.date)}
                                                </td>

                                                <td className="px-4 py-3 text-right">
                                                    {item.paymentCount}
                                                </td>

                                                <td className="px-4 py-3 text-right font-medium">
                                                    {item.revenue.toLocaleString("vi-VN")} VNĐ
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {revenue.length === 0 && (
                                    <p className="p-6 text-center text-sm text-muted-foreground">
                                        Không tải được dữ liệu doanh thu.
                                    </p>
                                )}
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-xl border bg-card">
                            <div className="border-b p-4">
                                <h2 className="font-semibold">
                                    Tỷ lệ lấp đầy theo ngày
                                </h2>
                            </div>

                            <div className="max-h-[480px] overflow-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="sticky top-0 bg-muted text-xs text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3">Ngày</th>
                                            <th className="px-4 py-3 text-right">
                                                Phòng sử dụng
                                            </th>
                                            <th className="px-4 py-3 text-right">
                                                Tổng phòng
                                            </th>
                                            <th className="px-4 py-3 text-right">
                                                Tỷ lệ
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y">
                                        {occupancy.map((item) => (
                                            <tr key={item.date}>
                                                <td className="px-4 py-3">
                                                    {formatDate(item.date)}
                                                </td>

                                                <td className="px-4 py-3 text-right">
                                                    {item.occupiedRooms}
                                                </td>

                                                <td className="px-4 py-3 text-right">
                                                    {item.totalRooms}
                                                </td>

                                                <td className="px-4 py-3 text-right font-medium">
                                                    {item.occupancyRate.toLocaleString("vi-VN", {
                                                        maximumFractionDigits: 2,
                                                    })}
                                                    %
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {occupancy.length === 0 && (
                                    <p className="p-6 text-center text-sm text-muted-foreground">
                                        Không tải được dữ liệu tỷ lệ lấp đầy.
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>
                </>
            )}
        </div>
    );
}
