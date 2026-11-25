export interface CancellationDto { cancellationId: number; bookingId: number; cancellationPolicyId: number; reason: string | null; refundPercentage: number; refundAmount: number; status: number; createAt: string | null; }
export interface CancellationCreateDto { bookingId: number; reason: string; }
