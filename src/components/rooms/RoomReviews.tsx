
"use client";

import { useState } from "react";
import {
    ChevronDown,
    MessageSquare,
    Star,
} from "lucide-react";

import { getReviews } from "@/app/api/review.api";
import type { ReviewDto } from "@/types/review";

interface RoomReviewsProps {
    roomId: number;
}

export default function RoomReviews({ roomId }: RoomReviewsProps) {
    const [reviews, setReviews] = useState<ReviewDto[]>([]);
    const [showReviews, setShowReviews] = useState(false);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState("");
    const [reviewsLoaded, setReviewsLoaded] = useState(false);

    // Tải danh sách đánh giá của phòng
    async function loadReviews() {
        setReviewLoading(true);
        setReviewError("");

        try {
            const data = await getReviews();

            const roomReviews = (Array.isArray(data) ? data : [])
                .filter(
                    (review) =>
                        review.roomId === roomId &&
                        Number(review.status) === 1,
                )
                .sort((a, b) => {
                    return (
                        new Date(b.createAt ?? 0).getTime() -
                        new Date(a.createAt ?? 0).getTime()
                    );
                });

            setReviews(roomReviews);
            setReviewsLoaded(true);
        } catch (cause) {
            setReviewError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể tải đánh giá phòng.",
            );
        } finally {
            setReviewLoading(false);
        }
    }

    // Mở hoặc đóng danh sách đánh giá
    async function toggleReviews() {
        const next = !showReviews;

        setShowReviews(next);

        if (!next || reviewsLoaded || reviewLoading) {
            return;
        }

        await loadReviews();
    }

    // Thử tải lại đánh giá khi gặp lỗi
    async function retryLoadReviews() {
        setReviewsLoaded(false);
        await loadReviews();
    }

    // Tính điểm đánh giá trung bình
    const averageRating =
        reviews.length > 0
            ? reviews.reduce(
                (total, review) => total + review.rating,
                0,
            ) / reviews.length
            : 0;

    return (
        <section className="border-t pt-6">
            <button
                type="button"
                onClick={() => void toggleReviews()}
                className="flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-muted/50"
                aria-expanded={showReviews}
            >
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <MessageSquare className="size-5 text-primary" />
                    </div>

                    <div>
                        <p className="font-semibold">
                            Xem đánh giá phòng
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            {reviewsLoaded
                                ? `${reviews.length} đánh giá đã được duyệt`
                                : "Xem nhận xét từ khách hàng"}
                        </p>
                    </div>
                </div>

                <ChevronDown
                    className={`size-5 shrink-0 text-muted-foreground transition-transform ${showReviews ? "rotate-180" : ""
                        }`}
                />
            </button>

            {showReviews && (
                <div className="mt-4 space-y-4">
                    {/* Đang tải */}
                    {reviewLoading && (
                        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                            <span className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            Đang tải đánh giá...
                        </div>
                    )}

                    {/* Lỗi */}
                    {!reviewLoading && reviewError && (
                        <div className="rounded-xl border border-destructive/30 p-4 text-sm text-destructive">
                            <p>{reviewError}</p>

                            <button
                                type="button"
                                onClick={() => void retryLoadReviews()}
                                className="mt-2 font-semibold underline"
                            >
                                Thử tải lại
                            </button>
                        </div>
                    )}

                    {/* Không có đánh giá */}
                    {!reviewLoading &&
                        !reviewError &&
                        reviewsLoaded &&
                        reviews.length === 0 && (
                            <div className="rounded-xl border border-dashed p-8 text-center">
                                <MessageSquare className="mx-auto size-8 text-muted-foreground/50" />

                                <p className="mt-3 font-medium">
                                    Chưa có đánh giá
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Phòng này chưa có đánh giá nào được duyệt.
                                </p>
                            </div>
                        )}

                    {/* Có đánh giá */}
                    {!reviewLoading &&
                        !reviewError &&
                        reviews.length > 0 && (
                            <>
                                {/* Tổng quan đánh giá */}
                                <div className="rounded-xl border bg-muted/30 p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Điểm đánh giá trung bình
                                            </p>
                                            <div className="flex">
                                                <p className="mt-1 flex items-center text-3xl font-bold">
                                                    {averageRating.toFixed(1)}

                                                    <span className="ml-1 flex items-center text-3xl font-normal text-muted-foreground">
                                                        / 5

                                                        <Star className="ml-1 size-5 fill-amber-400 text-amber-400" />
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="flex justify-end gap-0.5">
                                                {[1, 2, 3, 4, 5].map(
                                                    (star) => (
                                                        <Star
                                                            key={star}
                                                            className={`size-5 ${star <= Math.round(
                                                                averageRating,
                                                            )
                                                                    ? "fill-amber-400 text-amber-400"
                                                                    : "text-muted-foreground/30"
                                                                }`}
                                                        />
                                                    ),
                                                )}
                                            </div>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {reviews.length} lượt đánh giá
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Danh sách đánh giá */}
                                {reviews.map((review) => (
                                    <article
                                        key={review.reviewId}
                                        className="rounded-xl border p-4"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <p className="font-semibold">
                                                    {review.customerName || "Khách hàng"}
                                                </p>

                                                <div className="mt-2 flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <Star
                                                                key={star}
                                                                className={`size-4 ${star <= review.rating
                                                                        ? "fill-amber-400 text-amber-400"
                                                                        : "text-muted-foreground/30"
                                                                    }`}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-xs text-muted-foreground">
                                                {review.createAt
                                                    ? new Date(
                                                        review.createAt,
                                                    ).toLocaleDateString(
                                                        "vi-VN",
                                                    )
                                                    : "Không rõ ngày"}
                                            </p>
                                        </div>

                                        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                                            {review.comment ||
                                                "Khách hàng không để lại nhận xét."}
                                        </p>
                                    </article>
                                ))}
                            </>
                        )}
                </div>
            )}
        </section>
    );
}
