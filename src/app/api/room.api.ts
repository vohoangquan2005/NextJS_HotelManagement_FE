import { fetchApi } from "./client";

import type {
    RoomCreateDto,
    RoomUpdateDto,
    RoomResponseDto,
    RoomFilterDto
} from "@/types/room";

export async function getAll(): Promise<RoomResponseDto[]> {
    return fetchApi<RoomResponseDto[]>("/Room");
}

export async function getRoomById(roomId: number): Promise<RoomResponseDto> {
    return fetchApi<RoomResponseDto>(`/Room/${roomId}`);
}
export async function filterRooms(filters: RoomFilterDto,): Promise<RoomResponseDto[]> {
    const params = new URLSearchParams();
    if (filters.roomTypeId !== null) {
        params.set("RoomTypeId", String(filters.roomTypeId));
    }
    if (filters.minPrice !== null) {
        params.set("MinPrice", String(filters.minPrice));
    }
    if (filters.maxPrice !== null) {
        params.set("MaxPrice", String(filters.maxPrice));
    }
    if (filters.minCapacity !== null) {
        params.set("MinCapacity", String(filters.minCapacity));
    }
    if (filters.maxCapacity !== null) {
        params.set("MaxCapacity", String(filters.maxCapacity));
    }
    const query = params.toString();
    return fetchApi<RoomResponseDto[]>( `/Room/filter${query ? `?${query}` : ""}`);
}