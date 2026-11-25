import { fetchApi } from "./client";
import type { BookingCreateOnlineDto, BookingResponseDto } from "@/types/booking";

export function getMyBookings(): Promise<BookingResponseDto[]> {
  return fetchApi<BookingResponseDto[]>("/Booking/my-bookings");
}

export function getMyBookingDetail(bookingId: number): Promise<BookingResponseDto> {
  return fetchApi<BookingResponseDto>(`/Booking/my-bookings/${bookingId}`);
}

export function getBookings(): Promise<BookingResponseDto[]> {
  return fetchApi<BookingResponseDto[]>("/Booking");
}

export function getBookingById(bookingId: number): Promise<BookingResponseDto> {
  return fetchApi<BookingResponseDto>(`/Booking/${bookingId}`);
}

export function checkInBookingDetail(bookingDetailId: number): Promise<void> {
  return fetchApi<void>(`/BookingDetail/${bookingDetailId}/checkin`, { method: "PUT" });
}

export function checkOutBookingDetail(bookingDetailId: number): Promise<void> {
  return fetchApi<void>(`/BookingDetail/${bookingDetailId}/checkout`, { method: "PUT" });
}

export function getDeletedBookings(): Promise<BookingResponseDto[]> {
  return fetchApi<BookingResponseDto[]>("/Booking/deleted");
}

export function confirmBooking(bookingId: number): Promise<BookingResponseDto> {
  return fetchApi<BookingResponseDto>(`/Booking/${bookingId}/confirm`, { method: "PATCH" });
}
export function rejectBooking(bookingId: number): Promise<void> {
  return fetchApi<void>(`/Booking/${bookingId}/reject`, { method: "PUT" });
}

export function softDeleteBooking(bookingId: number): Promise<void> {
  return fetchApi<void>(`/Booking/${bookingId}/soft-deleted`, { method: "PATCH" });
}

export function restoreBooking(bookingId: number): Promise<void> {
  return fetchApi<void>(`/Booking/${bookingId}/restore`, { method: "PATCH" });
}

export function createOnlineBooking(data: BookingCreateOnlineDto): Promise<BookingResponseDto> {
  return fetchApi<BookingResponseDto>("/Booking/online", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
