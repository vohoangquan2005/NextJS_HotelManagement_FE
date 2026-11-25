import { fetchApi } from "./client";
import type { FavoriteRoomCreateDto, FavoriteRoomResponseDto } from "@/types/favorite-room";

export function getMyFavoriteRooms(): Promise<FavoriteRoomResponseDto[]> {
  return fetchApi<FavoriteRoomResponseDto[]>("/FavoriteRoom");
}

export function addFavoriteRoom(data: FavoriteRoomCreateDto): Promise<FavoriteRoomResponseDto> {
  return fetchApi<FavoriteRoomResponseDto>("/FavoriteRoom", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function removeFavoriteRoom(favoriteRoomId: number): Promise<void> {
  return fetchApi<void>(`/FavoriteRoom/${favoriteRoomId}`, { method: "DELETE" });
}
