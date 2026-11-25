export interface ReviewDto { 
    reviewId: number; 
    customerId: number; 
    customerName: string | null; 
    roomId: number; 
    roomName: string | null; 
    bookingId: number; 
    rating: number; 
    comment: string | null; 
    status: number; 
    createAt: string | null; }

export interface ReviewCreateDto {
    customerId: number;
    roomId: number;
    bookingId: number;
    rating: number;
    comment: string | null;
}

export interface CustomerBookingReviewsDto {
    bookingId: number;
    canReview: boolean;
    reviews: ReviewDto[];
}
