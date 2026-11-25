export interface RoomTypeDto {
  roomTypeId: number;
  roomTypeName: string | null;
  bedCount: number;
  bedType: string | null;
  size: string | null;
  description: string | null;
  isDeleted: number;
}

export interface RoomTypeWriteDto {
  roomTypeName: string;
  bedCount: number;
  bedType: string;
  size: string;
  description: string | null;
}
