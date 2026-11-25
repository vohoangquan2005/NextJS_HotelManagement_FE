"use client";

import { useCallback, useEffect, useState } from "react";
import { Star } from "lucide-react";
import { createReview, getMyBookingReviews } from "@/app/api/review.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorAlertDialog } from "@/components/common/ErrorAlertDialog";
import { useAuth } from "@/contexts/AuthContext";
import type { CustomerBookingReviewsDto } from "@/types/review";

const reviewStatus = ["Đang chờ duyệt", "Đã duyệt", "Bị từ chối"];

export function CustomerBookingReviews({
    bookingId,
    bookingStatus,
    rooms,
}: {
    bookingId: number;
    bookingStatus: number;
    rooms: { roomId: number; roomName: string | null }[];
}) {
    const { user } = useAuth();
    const [data, setData] = useState<CustomerBookingReviewsDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [sendingRoomId, setSendingRoomId] = useState<number | null>(null);
    const [ratings, setRatings] = useState<Record<number, number>>({});
    const [comments, setComments] = useState<Record<number, string>>({});
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        try {
            setData(await getMyBookingReviews(bookingId));
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Không thể tải đánh giá.");
        } finally {
            setLoading(false);
        }
    }, [bookingId]);

    useEffect(() => {
        queueMicrotask(() => void load());
    }, [load]);

    async function submit(roomId: number) {
        if (!user?.customerId || !ratings[roomId]) return;
        setSendingRoomId(roomId);
        setError("");
        setNotice("");
        try {
            await createReview({
                customerId: user.customerId,
                roomId,
                bookingId,
                rating: ratings[roomId],
                comment: comments[roomId]?.trim() || null,
            });
            setNotice("Đánh giá đã được gửi và đang chờ nhân viên duyệt.");
            await load();
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Không thể gửi đánh giá.");
        } finally {
            setSendingRoomId(null);
        }
    }

    if (bookingStatus !== 3) return null;

    return (
        <section className="mt-8 space-y-4 border-t pt-6">
            <div>
                <h2 className="text-lg font-semibold">Đánh giá phòng</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Bạn có thể gửi một đánh giá cho mỗi phòng sau khi hoàn tất thanh toán.
                </p>
            </div>

            {loading ? (
                <p className="text-sm text-muted-foreground">Đang tải trạng thái đánh giá…</p>
            ) : !data ? (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Chưa tải được trạng thái đánh giá.</p>
                    <Button variant="outline" onClick={() => void load()}>Thử tải lại</Button>
                </div>
            ) : (
                rooms.map((room) => {
                    const review = data?.reviews.find((item) => item.roomId === room.roomId);
                    return (
                        <Card key={room.roomId}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">
                                    {room.roomName || `Phòng #${room.roomId}`}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {review ? (
                                    <div className="space-y-2 text-sm">
                                        <p className="font-medium">
                                            Trạng thái: {reviewStatus[Number(review.status)] ?? "Không xác định"}
                                        </p>
                                        <div className="flex" aria-label={`${review.rating} trên 5 sao`}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className={`size-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                                            ))}
                                        </div>
                                        <p className="whitespace-pre-line text-muted-foreground">
                                            {review.comment || "Không có nhận xét."}
                                        </p>
                                    </div>
                                ) : data?.canReview ? (
                                    <div className="space-y-3">
                                        <div className="flex gap-1" role="radiogroup" aria-label="Số sao đánh giá">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={ratings[room.roomId] === star}
                                                    aria-label={`${star} sao`}
                                                    onClick={() => setRatings((current) => ({ ...current, [room.roomId]: star }))}
                                                >
                                                    <Star className={`size-6 ${star <= (ratings[room.roomId] ?? 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                            value={comments[room.roomId] ?? ""}
                                            onChange={(event) => setComments((current) => ({ ...current, [room.roomId]: event.target.value }))}
                                            maxLength={1000}
                                            placeholder="Chia sẻ trải nghiệm của bạn"
                                        />
                                        <Button
                                            disabled={!ratings[room.roomId] || sendingRoomId === room.roomId}
                                            onClick={() => void submit(room.roomId)}
                                        >
                                            {sendingRoomId === room.roomId ? "Đang gửi…" : "Gửi đánh giá"}
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Đánh giá sẽ mở sau khi hóa đơn được thanh toán đầy đủ.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    );
                })
            )}
            {notice && <p role="status" className="text-sm text-emerald-700">{notice}</p>}
            <ErrorAlertDialog message={error} onClose={() => setError("")} />
        </section>
    );
}
