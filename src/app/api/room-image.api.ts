import { fetchApi } from "./client";
import type { RoomImageDto } from "@/types/room-image";
export const getRoomImages = () => fetchApi<RoomImageDto[]>("/RoomImage");
export const getPublicRoomImages = () => fetchApi<RoomImageDto[]>("/RoomImage/public");
export function createRoomImage(data: { roomId: number; image: File; isPrimary: number; displayOrder: number }) { const body = new FormData(); body.append("RoomId", String(data.roomId)); body.append("Image", data.image); body.append("IsPrimary", String(data.isPrimary)); body.append("DisplayOrder", String(data.displayOrder)); return fetchApi<RoomImageDto>("/RoomImage", { method: "POST", body }); }
export function updateRoomImage(id: number, data: { isPrimary: number; displayOrder: number }) { const body = new FormData(); body.append("IsPrimary", String(data.isPrimary)); body.append("DisplayOrder", String(data.displayOrder)); return fetchApi<void>(`/RoomImage/${id}`, { method: "PUT", body }); }
export const deleteRoomImage = (id: number) => fetchApi<void>(`/RoomImage/${id}`, { method: "DELETE" });
