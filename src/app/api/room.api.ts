import { fetchApi } from "./client";

import type {
    RoomCreateDto,
    RoomUpdateDto,
    RoomResponseDto,
    RoomFilterDto
} from "@/types/room";
import { getPublicRoomImages } from "@/app/api/room-image.api";

async function attachRoomImages(rooms: RoomResponseDto[]): Promise<RoomResponseDto[]> {
    const publicImages = await getPublicRoomImages().catch(() => []);
    const safeImages = Array.isArray(publicImages) ? publicImages : [];
    return (Array.isArray(rooms) ? rooms : []).map((room) => {
        const images = safeImages.filter((image) => image.roomId === room.roomId);
        return {
            ...room,
            roomImages: images.length > 0 ? images : (room.roomImages ?? []),
        };
    });
}

export async function getAll(): Promise<RoomResponseDto[]> {
    const rooms = await fetchApi<RoomResponseDto[]>("/Room");
    return attachRoomImages(rooms);
}

export async function getRoomById(roomId: number): Promise<RoomResponseDto> {
    const room = await fetchApi<RoomResponseDto>(`/Room/${roomId}`);
    const [withImages] = await attachRoomImages([room]);
    return withImages;
}

export async function getDeletedRooms(): Promise<RoomResponseDto[]> {
    return fetchApi<RoomResponseDto[]>("/Room/deleted");
}

export async function softDeleteRoom(roomId: number): Promise<void> {
    return fetchApi<void>(`/Room/${roomId}/soft-delete`, { method: "PATCH" });
}

export async function restoreRoom(roomId: number): Promise<void> {
    return fetchApi<void>(`/Room/${roomId}/restore`, { method: "PATCH" });
}

export async function deleteRoom(roomId: number): Promise<void> {
    return fetchApi<void>(`/Room/${roomId}`, { method: "DELETE" });
}

export async function createRoom(data: RoomCreateDto): Promise<RoomResponseDto> {
    return fetchApi<RoomResponseDto>("/Room", { method: "POST", body: JSON.stringify(data) });
}

export async function updateRoom(roomId: number, data: RoomUpdateDto): Promise<void> {
    return fetchApi<void>(`/Room/${roomId}`, { method: "PUT", body: JSON.stringify(data) });
}
export async function filterRooms(filters: RoomFilterDto,): Promise<RoomResponseDto[]> {
    const params = new URLSearchParams();
    if (filters.roomTypeId != null) {
        params.set("RoomTypeId", String(filters.roomTypeId));
    }
    if (filters.minPrice != null) {
        params.set("MinPrice", String(filters.minPrice));
    }
    if (filters.maxPrice != null) {
        params.set("MaxPrice", String(filters.maxPrice));
    }
    if (filters.minCapacity != null) {
        params.set("MinCapacity", String(filters.minCapacity));
    }
    if (filters.maxCapacity != null) {
        params.set("MaxCapacity", String(filters.maxCapacity));
    }
    const query = params.toString();
    const rooms = await fetchApi<RoomResponseDto[]>(
        `/Room/filter${query ? `?${query}` : ""}`
    );
    return attachRoomImages(rooms);
}
