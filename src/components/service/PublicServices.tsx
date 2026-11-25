
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowUpRight,
    ConciergeBell,
    LoaderCircle,
    RefreshCw,
} from "lucide-react";

import { getServices } from "@/app/api/service.api";
import { useAuth } from "@/contexts/AuthContext";
import type { ServiceResponseDto } from "@/types/service";

export default function PublicServices() {
    const { user, isLoading: authLoading } = useAuth();

    const [services, setServices] = useState<ServiceResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading || !user) return;

        let active = true;

        getServices()
            .then((data) => {
                if (active) setServices(data);
            })
            .catch((cause: unknown) => {
                if (active) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : "Không thể tải dịch vụ.",
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [authLoading, user]);

    async function reload() {
        setLoading(true);
        setError(null);

        try {
            setServices(await getServices());
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể tải dịch vụ.",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    Tiện ích lưu trú
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                    Dịch vụ khách sạn
                </h1>

                <p className="mt-4 text-muted-foreground">
                    Danh sách dịch vụ được tải từ hệ thống quản lý khách sạn.
                </p>
            </div>

            {authLoading || (user !== null && loading) ? (
                <div
                    className="flex min-h-64 items-center justify-center gap-3 text-muted-foreground"
                    role="status"
                >
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải dịch vụ…
                </div>
            ) : !user ? (
                <div className="mx-auto mt-10 max-w-xl rounded-2xl border bg-card p-8 text-center">
                    <ConciergeBell className="mx-auto size-10 text-primary" />

                    <h2 className="mt-4 text-lg font-semibold">
                        Cần đăng nhập để xem dịch vụ
                    </h2>

                    <Link
                        className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                        href="/login"
                    >
                        Đăng nhập
                    </Link>
                </div>
            ) : error ? (
                <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-destructive/30 p-8 text-center">
                    <p className="font-semibold text-destructive">
                        Không thể tải dịch vụ
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground">{error}</p>

                    <button
                        onClick={() => void reload()}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
                    >
                        <RefreshCw className="size-4" />
                        Thử lại
                    </button>
                </div>
            ) : services.length === 0 ? (
                <div className="mt-10 rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
                    Hiện chưa có dịch vụ nào.
                </div>
            ) : (
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <article
                            key={service.serviceId}
                            className="group rounded-2xl border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <ConciergeBell className="size-6" />
                            </div>

                            <h2 className="mt-5 text-lg font-semibold">
                                <Link
                                    href={`/service/${service.serviceId}`}
                                    className="hover:text-primary"
                                >
                                    {service.serviceName ||
                                        `Dịch vụ #${service.serviceId}`}
                                </Link>
                            </h2>

                            {service.description && (
                                <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
                                    {service.description}
                                </p>
                            )}

                            <div className="mt-5 flex items-end justify-between border-t pt-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Đơn giá{service.unit ? ` / ${service.unit}` : ""}
                                    </p>

                                    <p className="mt-1 font-bold text-primary">
                                        {service.unitPrice.toLocaleString("vi-VN")} VNĐ
                                    </p>
                                </div>

                                <span
                                    aria-label="Chi tiết dịch vụ chỉ dành cho nhân viên"
                                    className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                                >
                                    {user.roleName === "Admin" ||
                                    user.roleName === "Staff"
                                        ? "Chi tiết"
                                        : ""}
                                    <ArrowUpRight className="size-4" />
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
