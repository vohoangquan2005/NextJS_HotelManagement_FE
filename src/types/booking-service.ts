export interface BookingServiceDto { bookingServiceId: number; bookingId: number; serviceId: number; serviceName: string | null; quantity: number; unitPrice: number; totalAmount: number; }
export interface BookingServiceCreateDto { bookingId: number; serviceId: number; quantity: number; }
