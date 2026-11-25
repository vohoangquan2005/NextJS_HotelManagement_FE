"use client";

import { useEffect, useState } from "react";
import {
    BedDouble,
    CalendarCheck,
    CircleAlert,
    LoaderCircle,
    RefreshCw,
    Users,
    ConciergeBell,
    Tags,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { getDashboardOverview } from "@/app/api/dashboard.api";
import type { DashboardResponseDto } from "@/types/dashboard";

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function load() {
        setLoading(true);
        setError("");

        try {
            setData(await getDashboardOverview());
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể tải dashboard."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let active = true;

        void getDashboardOverview()
            .then((overview) => {
                if (active) {
                    setData(overview);
                }
            })
            .catch((cause: unknown) => {
                if (active) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : "Không thể tải dashboard."
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

    const metrics = data
        ? [
            {
                title: "Tổng số phòng",
                value: data.totalRooms,
                detail: `${data.availableRooms} trống · ${data.occupiedRooms} đang sử dụng · ${data.maintenanceRooms} bảo trì`,
                icon: BedDouble,
            },
            {
                title: "Đặt phòng chờ xử lý",
                value: data.pendingBookings,
                detail: `${data.confirmedBookings} đã xác nhận · ${data.checkedInBookings} đang lưu trú`,
                icon: CalendarCheck,
            },
            {
                title: "Khách hàng",
                value: data.totalCustomers,
                detail: `${data.newCustomersThisMonth} khách mới tháng này`,
                icon: Users,
            },
            {
                title: "Nhận phòng hôm nay",
                value: data.todayCheckIns,
                detail: `${data.todayCheckOuts} lượt trả phòng dự kiến`,
                icon: CalendarCheck,
            },
            {
                title: "Dịch vụ hoạt động",
                value: data.activeServices,
                detail: `${data.serviceUsagesThisMonth} lượt dùng trong tháng`,
                icon: ConciergeBell,
            },
            {
                title: "Khuyến mãi đang hiệu lực",
                value: data.activePromotions,
                detail: `${data.expiringPromotions} sắp hết hạn · ${data.expiredPromotions} đã hết hạn`,
                icon: Tags,
            },
        ]
        : [];

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                    Quản trị khách sạn
                </p>
                <h1 className="mt-2 text-3xl font-bold">Tổng quan</h1>
            </div>

            {loading ? (
                <div className="flex min-h-56 items-center justify-center gap-3 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải số liệu…
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
                        onClick={() => void load()}
                        className="mt-4 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-foreground"
                    >
                        <RefreshCw className="size-4" />
                        Thử lại
                    </button>
                </div>
            ) : !data ? (
                <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                    API chưa trả dữ liệu.
                </div>
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {metrics.map(({ title, value, detail, icon: Icon }) => (
                            <Card key={title}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {title}
                                    </CardTitle>

                                    <Icon className="size-5 text-primary" />
                                </CardHeader>

                                <CardContent>
                                    <p className="text-3xl font-bold">
                                        {value.toLocaleString("vi-VN")}
                                    </p>

                                    <p className="mt-2 text-xs text-muted-foreground">
                                        {detail}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <section className="rounded-xl border bg-card p-5">
                        <h2 className="font-semibold">Trạng thái đặt phòng</h2>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            {[
                                ["Chờ xử lý", data.pendingBookings],
                                ["Đã xác nhận", data.confirmedBookings],
                                ["Đang lưu trú", data.checkedInBookings],
                                ["Hoàn tất", data.completedBookings],
                                ["Đã hủy", data.cancelledBookings],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="rounded-lg bg-muted/50 p-3"
                                >
                                    <p className="text-xs text-muted-foreground">
                                        {label}
                                    </p>

                                    <p className="mt-1 text-xl font-semibold">
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
