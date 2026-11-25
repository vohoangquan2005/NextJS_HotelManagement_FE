export interface BookingDetailCreateDto {
  roomId: number;
  guestCount: number;
}

export interface BookingCreateOnlineDto {
  expectedCheckIn: string;
  expectedCheckOut: string;
  guestCount: number;
  roomCount: number;
  promotionId: number | null;
  servicePackageId: number | null;
  note: string | null;
  bookingDetails: BookingDetailCreateDto[];
}

export interface BookingDetailResponseDto {
  bookingDetailId: number;
  bookingId: number;
  roomId: number;
  roomName: string | null;
  roomTypeName: string | null;
  actualCheckIn: string | null;
  actualCheckOut: string | null;
  pricePerNight: number;
  totalAmount: number;
  guestCount: number;
  createAt?: string | null;
}

export interface BookingServiceResponseDto {
  bookingServiceId: number;
  bookingId: number;
  serviceId: number;
  serviceName: string | null;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  createAt?: string | null;
}

export interface BookingResponseDto {
  bookingId: number;
  customerId: number;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  bookingDate: string;
  expectedCheckIn: string;
  expectedCheckOut: string;
  guestCount: number;
  roomCount: number;
  promotionCode: string | null;
  promotionName: string | null;
  discountType: 0 | 1 | null;
  discountValue: number | null;
  packageName: string | null;
  depositAmount: number;
  roomAmount: number;
  packageAmount: number;
  discountAmount: number;
  additionalServiceAmount: number;
  totalAmount: number;
  note: string | null;
  status: string | number;
  bookingDetails: BookingDetailResponseDto[];
  bookingServices: BookingServiceResponseDto[];
}
