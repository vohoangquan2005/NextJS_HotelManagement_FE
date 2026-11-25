
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ConciergeBell, LoaderCircle } from "lucide-react";

import { getServices } from "@/app/api/service.api";
import { useAuth } from "@/contexts/AuthContext";
import type { ServiceResponseDto } from "@/types/service";

export default function PublicServiceDetail() {
    const { id } = useParams<{ id: string }>();
    const { user, isLoading: authLoading } = useAuth();

    const [service, setService] = useState<ServiceResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading || !user) return;

        let active = true;

        void getServices()
            .then((items) => {
                if (active) {
                    setService(
                        items.find((item) => item.serviceId === Number(id)) ?? null,
                    );
                }
            })
            .catch((cause: unknown) => {
                if (active) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : "Không thể tải thông tin dịch vụ.",
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [authLoading, user, id]);

    return (
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <Link
                href="/service"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="size-4" />
                Danh sách dịch vụ
            </Link>

            {authLoading ? (
                <div className="flex min-h-64 items-center justify-center gap-3 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải phiên đăng nhập…
                </div>
            ) : !user ? (
                <div className="mt-8 rounded-2xl border p-8 text-center">
                    <h1 className="font-semibold">
                        Đăng nhập để xem chi tiết dịch vụ
                    </h1>
                    <Link
                        href="/login"
                        className="mt-4 inline-block text-primary underline"
                    >
                        Đăng nhập
                    </Link>
                </div>
            ) : loading ? (
                <div className="flex min-h-64 items-center justify-center gap-3 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải dịch vụ…
                </div>
            ) : error ? (
                <p
                    role="alert"
                    className="mt-8 rounded-xl border border-destructive/30 p-6 text-destructive"
                >
                    {error}
                </p>
            ) : !service ? (
                <p className="mt-8 rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                    Không tìm thấy dịch vụ.
                </p>
            ) : (
                <article className="mt-8 grid overflow-hidden rounded-3xl border bg-card md:grid-cols-[1.3fr_0.7fr]">
                    <div className="p-7 sm:p-10">
                        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                            Thông tin dịch vụ
                        </p>

                        <h1 className="mt-3 text-3xl font-bold">
                            {service.serviceName || `Dịch vụ #${service.serviceId}`}
                        </h1>

                        <p className="mt-5 whitespace-pre-line leading-7 text-muted-foreground">
                            {service.description || "Chưa có mô tả dịch vụ."}
                        </p>
                    </div>

                    <aside className="flex flex-col justify-center border-t bg-muted/30 p-7 md:border-l md:border-t-0 sm:p-10">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ConciergeBell className="size-6" />
                        </div>

                        <p className="mt-5 text-sm text-muted-foreground">
                            Đơn giá{service.unit ? ` / ${service.unit}` : ""}
                        </p>

                        <p className="mt-1 text-3xl font-bold text-primary">
                            {service.unitPrice.toLocaleString("vi-VN")} VNĐ
                        </p>
                    </aside>
                </article>
            )}
        </div>
    );
}
