import { fetchApi } from "./client";
import type { BookingServiceCreateDto, BookingServiceDto } from "@/types/booking-service";
export const getBookingServices = () => fetchApi<BookingServiceDto[]>("/BookingService");
export const createBookingService = (data: BookingServiceCreateDto) => fetchApi<BookingServiceDto>("/BookingService", { method: "POST", body: JSON.stringify(data) });
export const updateBookingService = (id: number, quantity: number) => fetchApi<void>(`/BookingService/${id}`, { method: "PUT", body: JSON.stringify({ quantity }) });
export const deleteBookingService = (id: number) => fetchApi<void>(`/BookingService/${id}`, { method: "DELETE" });
