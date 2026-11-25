"use client";
import { useCallback, useEffect, useState } from "react";
import { Check, LoaderCircle, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    getCancellations,
    approveCancellation,
    rejectCancellation,
} from "@/app/api/cancellation.api";
import type { CancellationDto } from "@/types/cancellation";
const labels = ["Chờ xử lý", "Đã duyệt", "Bị từ chối"];
export default function CancellationManagement() {
    const [items, setItems] = useState<CancellationDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [busy, setBusy] = useState<number | null>(null);
    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getCancellations();
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể tải yêu cầu hủy.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        getCancellations()
            .then((data) => {
                if (active) setItems(Array.isArray(data) ? data : []);
            })
            .catch((e) => {
                if (active) setError(e instanceof Error ? e.message : "Không thể tải yêu cầu hủy.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);
    async function action(item: CancellationDto, approve: boolean) {
        setBusy(item.cancellationId);
        setError("");
        try {
            if (approve) await approveCancellation(item.cancellationId);
            else await rejectCancellation(item.cancellationId);
            setNotice(approve ? "Đã duyệt yêu cầu hủy." : "Đã từ chối yêu cầu hủy.");
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể xử lý yêu cầu.");
        } finally {
            setBusy(null);
        }
    }
    return (
        <section className="space-y-6">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="mt-2 text-3xl font-bold">Yêu cầu hủy</h1>
                </div>
                <Button variant="outline" onClick={() => void load()} disabled={loading}>
                    <RefreshCw className="mr-2 size-4" />
                    Làm mới
                </Button>
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
            {loading ? (
                <div className="flex min-h-40 items-center justify-center gap-2 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải…
                </div>
            ) : !Array.isArray(items) || items.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                    Không có yêu cầu hủy.
                </div>
            ) : (
                <div className="space-y-3">
                    {(Array.isArray(items) ? items : []).map((x) => (
                        <article key={x.cancellationId} className="rounded-xl border bg-card p-4">
                            <div className="flex flex-wrap justify-between gap-3">
                                <div>
                                    <h2 className="font-semibold">
                                        Yêu cầu #{x.cancellationId} · Booking #{x.bookingId}
                                    </h2>
                                    <p className="mt-1 text-sm">{x.reason || "Không có lý do"}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Chính sách #{x.cancellationPolicyId} · Hoàn{" "}
                                        {x.refundPercentage}% (
                                        {x.refundAmount.toLocaleString("vi-VN")} VNĐ)
                                    </p>
                                </div>
                                <span className="h-fit rounded-full border px-2.5 py-1 text-xs">
                                    {labels[x.status] ?? String(x.status)}
                                </span>
                            </div>
                            {x.status === 0 && (
                                <div className="mt-3 flex justify-end gap-2">
                                    <Button
                                        size="sm"
                                        disabled={busy === x.cancellationId}
                                        onClick={() => void action(x, true)}
                                    >
                                        <Check className="mr-1 size-3" />
                                        Duyệt
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={busy === x.cancellationId}
                                        onClick={() => void action(x, false)}
                                    >
                                        <X className="mr-1 size-3" />
                                        Từ chối
                                    </Button>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
