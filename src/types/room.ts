export interface RoomCreateDto {
    roomName: string | null;
    roomTypeId: number;
    capacity: number;
    location: string | null;
    pricePerNight: number;
    description: string | null;
}

export interface RoomUpdateDto {
    roomName: string | null;
    roomTypeId: number;
    capacity: number;
    location: string | null;
    pricePerNight: number;
    description: string | null;
    status: number;
}

export interface RoomFilterDto {
    roomTypeId?: number | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    minCapacity?: number | null;
    maxCapacity?: number | null;
}

export interface RoomResponseDto {
    roomId: number;
    roomName: string | null;
    roomTypeId: number;
    roomTypeName: string | null;
    capacity: number;
    location: string | null;
    pricePerNight: number;
    description: string | null;
    status: number;
    isDeleted: number;
    createAt: string | null;
    updateAt: string | null;
    roomImages?: RoomImageResponseDto[];
}

export interface RoomImageResponseDto {
    roomImageId: number;
    roomId: number;
    roomName: string | null;
    imageUrl: string | null;
    isPrimary: number;
    displayOrder: number;
    createAt?: string | null;
    updateAt?: string | null;
}

export interface RoomTypeOption {
    roomTypeId: number;
    roomTypeName: string | null;
}
