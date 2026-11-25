import { fetchApi } from "./client";
import type { RoomTypeDto, RoomTypeWriteDto } from "@/types/room-type";

export const getRoomTypes = () => fetchApi<RoomTypeDto[]>("/RoomType");
export const getRoomTypeById = (id: number) => fetchApi<RoomTypeDto>(`/RoomType/${id}`);
export const getDeletedRoomTypes = () => fetchApi<RoomTypeDto[]>("/RoomType/deleted");
export const createRoomType = (body: RoomTypeWriteDto) => fetchApi<RoomTypeDto>("/RoomType", { method: "POST", body: JSON.stringify(body) });
export const updateRoomType = (id: number, body: RoomTypeWriteDto) => fetchApi<void>(`/RoomType/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const softDeleteRoomType = (id: number) => fetchApi<void>(`/RoomType/${id}/soft-delete`, { method: "PATCH" });
export const restoreRoomType = (id: number) => fetchApi<void>(`/RoomType/${id}/restore`, { method: "PATCH" });
export const deleteRoomType = (id: number) => fetchApi<void>(`/RoomType/${id}`, { method: "DELETE" });
