import type { RoomImageResponseDto } from "@/types/room";

/** Put the marked primary image first, then keep secondary images in display order. */
export function sortRoomImages(images?: RoomImageResponseDto[] | null) {
    return (images ?? [])
        .filter((image) => Boolean(image.imageUrl?.trim()))
        .slice()
        .sort(
            (left, right) =>
                Number(right.isPrimary === 1) - Number(left.isPrimary === 1) ||
                left.displayOrder - right.displayOrder ||
                left.roomImageId - right.roomImageId,
        );
}
