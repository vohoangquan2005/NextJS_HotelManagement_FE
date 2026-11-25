import { fetchApi } from "./client";
import type { CustomerBookingReviewsDto, ReviewCreateDto, ReviewDto } from "@/types/review";
export const getReviews = () => fetchApi<ReviewDto[]>("/Review");
export const getMyBookingReviews = (bookingId: number) =>
    fetchApi<CustomerBookingReviewsDto>(`/Review/my-bookings/${bookingId}`);
export const createReview = (review: ReviewCreateDto) =>
    fetchApi<ReviewDto>("/Review", { method: "POST", body: JSON.stringify(review) });
export const approveReview = (id: number) => fetchApi<void>(`/Review/${id}/confirm`, { method: "PUT" });
export const rejectReview = (id: number) => fetchApi<void>(`/Review/${id}/reject`, { method: "PUT" });
export const deleteReview = (id: number) => fetchApi<void>(`/Review/${id}`, { method: "DELETE" });
