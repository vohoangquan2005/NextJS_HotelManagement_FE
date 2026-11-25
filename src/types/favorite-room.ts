export interface FavoriteRoomCreateDto {
  roomId: number;
}

export interface FavoriteRoomResponseDto {
  favoriteRoomId: number;
  customerId: number;
  customerName?: string | null;
  roomId: number;
  roomName?: string | null;
  createAt?: string | null;
}
