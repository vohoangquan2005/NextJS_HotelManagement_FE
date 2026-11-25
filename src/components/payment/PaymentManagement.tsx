"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CircleAlert, CreditCard, LoaderCircle, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { confirmPayment, deletePayment, getPayments, rejectPayment } from "@/app/api/payment.api";
import type { PaymentResponseDto } from "@/types/payment";
import { PaymentList } from "@/components/payment/PaymentList";

export default function PaymentManagement() {
    const { user } = useAuth();

    const [payments, setPayments] = useState<PaymentResponseDto[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            setPayments(await getPayments());
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Không thể tải giao dịch.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;

        void getPayments()
            .then((data) => {
                if (active) setPayments(Array.isArray(data) ? data : []);
            })
            .catch((cause: unknown) => {
                if (active) {
                    setError(cause instanceof Error ? cause.message : "Không thể tải giao dịch.");
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const filtered = useMemo(() => {
        if (!Array.isArray(payments)) return [];
        const text = query.trim().toLocaleLowerCase("vi");

        return payments.filter(
            (item) =>
                !text ||
                `${item.paymentId} ${item.invoiceId} ${
                    item.transactionCode ?? ""
                } ${item.paymentMethod ?? ""}`
                    .toLocaleLowerCase("vi")
                    .includes(text),
        );
    }, [payments, query]);

    async function act(payment: PaymentResponseDto, action: "confirm" | "reject" | "delete") {
        const label =
            action === "confirm"
                ? "xác nhận giao dịch"
                : action === "reject"
                  ? "từ chối giao dịch"
                  : "xóa giao dịch";

        if (!window.confirm(`Bạn có chắc muốn ${label} #${payment.paymentId}?`)) {
            return;
        }

        setActiveId(payment.paymentId);
        setError("");
        setNotice("");

        try {
            if (action === "confirm") {
                await confirmPayment(payment.paymentId);
            } else if (action === "reject") {
                await rejectPayment(payment.paymentId);
            } else {
                await deletePayment(payment.paymentId);
            }

            setNotice(
                `Đã ${
                    action === "confirm" ? "xác nhận" : action === "reject" ? "từ chối" : "xóa"
                } giao dịch #${payment.paymentId}.`,
            );

            await load();
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : `Không thể ${label}.`);
        } finally {
            setActiveId(null);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="mt-2 text-3xl font-bold">Giao dịch thanh toán</h1>
                </div>

                <button
                    onClick={() => void load()}
                    disabled={loading}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm disabled:opacity-50"
                >
                    <RefreshCw className="size-4" />
                    Làm mới
                </button>
            </div>

            <div className="relative max-w-lg">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    className="pl-9"
                    placeholder="Tìm mã giao dịch, hóa đơn, mã giao dịch ngoài"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>

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
                    className="flex items-center gap-2 rounded-lg border border-destructive/30 p-3 text-sm text-destructive"
                >
                    <CircleAlert className="size-4" />
                    {error}
                </p>
            )}

            {loading ? (
                <div className="flex min-h-48 items-center justify-center gap-3 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải giao dịch…
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-10 text-center">
                    <CreditCard className="mx-auto size-8 text-muted-foreground/60" />

                    <p className="mt-3 text-sm text-muted-foreground">
                        {payments.length ? "Không tìm thấy kết quả." : "Chưa có giao dịch."}
                    </p>
                </div>
            ) : (
                <PaymentList
                    payments={filtered}
                    activeId={activeId}
                    isAdmin={user?.roleName === "Admin"}
                    onAction={(payment, action) => void act(payment, action)}
                />
            )}
        </div>
    );
}
