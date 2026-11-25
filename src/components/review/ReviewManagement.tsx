"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, LoaderCircle, RefreshCw, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { approveReview, deleteReview, getReviews, rejectReview } from "@/app/api/review.api";
import type { ReviewDto } from "@/types/review";

const names = ["Chờ xử lý", "Đã duyệt", "Bị từ chối"];
export default function ReviewManagement() {
    const { user } = useAuth();
    const [items, setItems] = useState<ReviewDto[]>([]);
    const [filter, setFilter] = useState("all");
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getReviews();
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể tải đánh giá.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        getReviews()
            .then((data) => {
                if (active) setItems(Array.isArray(data) ? data : []);
            })
            .catch((e) => {
                if (active) setError(e instanceof Error ? e.message : "Không thể tải đánh giá.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const rows = useMemo(() => {
        if (!Array.isArray(items)) return [];
        const q = query.trim().toLocaleLowerCase("vi");
        return items.filter(
            (x) =>
                (filter === "all" || x.status === Number(filter)) &&
                `${x.customerName ?? ""} ${x.roomName ?? ""} ${x.bookingId} ${x.comment ?? ""}`
                    .toLocaleLowerCase("vi")
                    .includes(q),
        );
    }, [items, filter, query]);
    async function act(item: ReviewDto, action: "approve" | "reject" | "delete") {
        if (action === "delete" && !window.confirm(`Xóa đánh giá #${item.reviewId}?`)) return;
        setBusy(item.reviewId);
        setError("");
        try {
            if (action === "approve") await approveReview(item.reviewId);
            else if (action === "reject") await rejectReview(item.reviewId);
            else await deleteReview(item.reviewId);
            setNotice(
                action === "approve"
                    ? "Đã duyệt đánh giá."
                    : action === "reject"
                      ? "Đã từ chối đánh giá."
                      : "Đã xóa đánh giá.",
            );
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Không thể cập nhật đánh giá.");
        } finally {
            setBusy(null);
        }
    }
    return (
        <section className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="mt-2 text-3xl font-bold">Đánh giá</h1>
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
            <div className="flex flex-wrap gap-2">
                {[
                    { id: "all", label: "Tất cả" },
                    ...names.map((label, index) => ({ id: String(index), label })),
                ].map((t) => (
                    <Button
                        key={t.id}
                        size="sm"
                        variant={filter === t.id ? "default" : "outline"}
                        onClick={() => setFilter(t.id)}
                    >
                        {t.label}
                    </Button>
                ))}
            </div>
            <div className="relative max-w-lg">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    className="pl-9"
                    placeholder="Tìm khách, phòng, booking hoặc nội dung"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            {loading ? (
                <div className="flex min-h-40 items-center justify-center gap-2 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải…
                </div>
            ) : rows.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                    Không có đánh giá phù hợp.
                </div>
            ) : (
                <div className="space-y-3">
                    {rows.map((x) => (
                        <article key={x.reviewId} className="rounded-xl border bg-card p-4">
                            <div className="flex flex-wrap justify-between gap-3">
                                <div>
                                    <h2 className="font-semibold">
                                        {x.customerName || `Khách #${x.customerId}`} ·{" "}
                                        {x.roomName || `Phòng #${x.roomId}`}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Booking #{x.bookingId} ·{" "}
                                        {x.createAt
                                            ? new Date(x.createAt).toLocaleString("vi-VN")
                                            : ""}
                                    </p>
                                </div>
                                <span className="h-fit rounded-full border px-2.5 py-1 text-xs">
                                    {names[x.status] ?? String(x.status)}
                                </span>
                            </div>
                            <p className="mt-3 text-sm">
                                {x.rating}/5 · {x.comment || "Không có nội dung"}
                            </p>
                            <div className="mt-3 flex justify-end gap-2">
                                {x.status === 0 && (
                                    <>
                                        <Button
                                            size="sm"
                                            disabled={busy === x.reviewId}
                                            onClick={() => void act(x, "approve")}
                                        >
                                            <Check className="mr-1 size-3" />
                                            Duyệt
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={busy === x.reviewId}
                                            onClick={() => void act(x, "reject")}
                                        >
                                            <X className="mr-1 size-3" />
                                            Từ chối
                                        </Button>
                                    </>
                                )}
                                {(user?.roleName === "Admin" || user?.roleName === "Staff") && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-destructive"
                                        disabled={busy === x.reviewId}
                                        onClick={() => void act(x, "delete")}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
