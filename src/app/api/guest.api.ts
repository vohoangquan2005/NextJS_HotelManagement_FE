import { fetchApi } from "./client";
import type { GuestDto, GuestWriteDto } from "@/types/guest";
export const getGuests = async (): Promise<GuestDto[]> => {
  const data = await fetchApi<GuestDto[]>("/Guest");
  return Array.isArray(data) ? data : [];
};
export const getGuest = (id: number) => fetchApi<GuestDto>(`/Guest/${id}`);
export const createGuest = (data: GuestWriteDto) => fetchApi<GuestDto>("/Guest", { method: "POST", body: JSON.stringify(data) });
export const updateGuest = (id: number, data: GuestWriteDto) => fetchApi<void>(`/Guest/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteGuest = (id: number) => fetchApi<void>(`/Guest/${id}`, { method: "DELETE" });
