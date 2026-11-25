
"use client";

import { useEffect, useState } from "react";
import {
    BedDouble,
    CalendarCheck,
    CircleAlert,
    LoaderCircle,
    RefreshCw,
    Users,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { getDashboardOverview } from "@/app/api/dashboard.api";
import type { DashboardResponseDto } from "@/types/dashboard";

export default function StaffDashboard() {
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
                if (active) setData(overview);
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
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const metrics = data
        ? [
            {
                title: "Phòng trống",
                value: data.availableRooms,
                detail: `${data.occupiedRooms} đang có khách · ${data.maintenanceRooms} bảo trì`,
                icon: BedDouble,
            },
            {
                title: "Nhận phòng hôm nay",
                value: data.todayCheckIns,
                detail: "Theo ngày dự kiến trong hệ thống",
                icon: CalendarCheck,
            },
            {
                title: "Trả phòng hôm nay",
                value: data.todayCheckOuts,
                detail: "Theo ngày dự kiến trong hệ thống",
                icon: CalendarCheck,
            },
            {
                title: "Booking chờ xử lý",
                value: data.pendingBookings,
                detail: `${data.confirmedBookings} đã xác nhận`,
                icon: Users,
            },
        ]
        : [];

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                    Nhân viên khách sạn
                </p>
                <h1 className="mt-2 text-3xl font-bold">
                    Tổng quan ca trực
                </h1>
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
                    Không tải được dữ liệu.
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            )}
        </div>
    );
}
