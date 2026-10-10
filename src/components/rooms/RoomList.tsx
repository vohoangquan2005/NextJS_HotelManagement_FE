"use client";

import { useEffect, useMemo, useState } from "react";
import {
    BedDouble,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
} from "lucide-react";

import RoomCard from "@/components/rooms/RoomCard";
import RoomDetail from "@/components/rooms/RoomDetail";
import { getAll } from "@/app/api/room.api";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { RoomResponseDto } from "@/types/room";
import RoomCardSkeleton from "@/components/rooms/RoomCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 4;

export default function RoomList() {
    const [rooms, setRooms] = useState<RoomResponseDto[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const {
        loading,
        error,
        handleSubmit,
    } = useFormSubmit<void, RoomResponseDto[]>(
        () => getAll(),
        {
            onSuccess: (data) => {
                setRooms(data);
                setCurrentPage(1);
                setSelectedRoomId(null);
            },
        },
    );
    function closeRoomDetail() {
        setSelectedRoomId(null);
    }
    useEffect(() => {
        void handleSubmit(undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalPages = Math.ceil(rooms.length / PAGE_SIZE);

    const paginatedRooms = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return rooms.slice(startIndex, startIndex + PAGE_SIZE);
    }, [rooms, currentPage]);

    function changePage(page: number) {
        setCurrentPage(Math.min(Math.max(page, 1), totalPages));
        setSelectedRoomId(null);
    }

    if (loading) {
        return (
            <section
                aria-label="Đang tải danh sách phòng"
                aria-busy="true"
            >
                <div className="mb-5 flex items-center justify-between gap-3">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-5 w-20" />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: PAGE_SIZE }, (_, index) => (
                        <RoomCardSkeleton key={index} />
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-destructive/30 p-8 text-center">
                <h2 className="font-semibold text-destructive">
                    Không thể tải danh sách phòng
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">{error}</p>

                <button
                    type="button"
                    onClick={() => void handleSubmit(undefined)}
                    className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    if (rooms.length === 0) {
        return (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
                <BedDouble className="size-12 text-muted-foreground/50" />

                <h2 className="mt-4 text-lg font-semibold">
                    Chưa có phòng nào
                </h2>
            </div>
        );
    }

    return (
        <section>
            <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Danh sách phòng</h2>

                <p className="text-sm text-muted-foreground">
                    {rooms.length} phòng
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedRooms.map((room) => (
                    <RoomCard
                        key={room.roomId}
                        room={room}
                        onSelect={setSelectedRoomId}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <nav
                    aria-label="Phân trang danh sách phòng"
                    className="mt-8 flex flex-wrap items-center justify-center gap-2"
                >
                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => changePage(currentPage - 1)}
                        className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft className="size-4" />
                        Trước
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                            <button
                                key={page}
                                type="button"
                                aria-current={currentPage === page ? "page" : undefined}
                                onClick={() => changePage(page)}
                                className={`size-10 rounded-md border text-sm ${currentPage === page
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                    }`}
                            >
                                {page}
                            </button>
                        ),
                    )}

                    <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => changePage(currentPage + 1)}
                        className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Sau
                        <ChevronRight className="size-4" />
                    </button>
                </nav>
            )}

            {selectedRoomId !== null && (
                <>
                    {/* Lớp nền mờ trên màn hình nhỏ */}
                    <button
                        type="button"
                        aria-label="Đóng chi tiết phòng"
                        onClick={closeRoomDetail}
                        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    />

                    {/* Panel chi tiết phòng */}
                    <aside className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l bg-background shadow-xl sm:w-[480px]">
                        <div className="flex items-center justify-between border-b p-4">
                            <h2 className="text-lg font-semibold">Chi tiết phòng</h2>

                            <button
                                type="button"
                                onClick={closeRoomDetail}
                                className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
                            >
                                X
                            </button>
                        </div>

                        <div className="p-4 sm:p-6">
                            <RoomDetail roomId={selectedRoomId} />
                        </div>
                    </aside>
                </>
            )}
        </section>
    );
}
