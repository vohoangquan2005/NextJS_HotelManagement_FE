"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CircleAlert, FileText, LoaderCircle, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { deleteInvoice, getInvoices } from "@/app/api/invoice.api";
import type { InvoiceResponseDto } from "@/types/invoice";
import { InvoiceList } from "@/components/invoice/InvoiceList";

export default function InvoiceManagement() {
    const { user } = useAuth();

    const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            setInvoices(await getInvoices());
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Không thể tải hóa đơn.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;

        void getInvoices()
            .then((data) => {
                if (active) setInvoices(Array.isArray(data) ? data : []);
            })
            .catch((cause: unknown) => {
                if (active) {
                    setError(cause instanceof Error ? cause.message : "Không thể tải hóa đơn.");
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const visible = useMemo(() => {
        const query = search.trim().toLocaleLowerCase("vi");

        return (invoices ?? []).filter(
            (invoice) =>
                !query ||
                `${invoice.invoiceId} ${invoice.bookingId} ${invoice.customerName ?? ""}`
                    .toLocaleLowerCase("vi")
                    .includes(query),
        );
    }, [invoices, search]);

    async function remove(invoice: InvoiceResponseDto) {
        if (
            !window.confirm(
                `Xóa hóa đơn #${invoice.invoiceId}?  Hóa đơn bị từ chối do đã có giao dịch thanh toán.`,
            )
        ) {
            return;
        }

        setActiveId(invoice.invoiceId);
        setError("");
        setNotice("");

        try {
            await deleteInvoice(invoice.invoiceId);
            setNotice(`Đã xóa hóa đơn #${invoice.invoiceId}.`);
            await load();
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Không thể xóa hóa đơn.");
        } finally {
            setActiveId(null);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="mt-2 text-3xl font-bold">Hóa đơn</h1>
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
                    placeholder="Tìm mã hóa đơn, đặt phòng, tên khách"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
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
                    Đang tải hóa đơn…
                </div>
            ) : visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-10 text-center">
                    <FileText className="mx-auto size-8 text-muted-foreground/60" />
                    <p className="mt-3 text-sm text-muted-foreground">
                        {invoices.length ? "Không tìm thấy kết quả." : "Chưa có hóa đơn."}
                    </p>
                </div>
            ) : (
                <InvoiceList
                    invoices={visible}
                    activeId={activeId}
                    isAdmin={user?.roleName === "Admin"}
                    onDelete={(invoice) => void remove(invoice)}
                />
            )}
        </div>
    );
}
