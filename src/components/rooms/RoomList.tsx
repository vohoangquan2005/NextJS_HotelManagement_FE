"use client";

import { useEffect, useMemo, useState } from "react";
import {
    BedDouble,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";

import RoomCard from "@/components/rooms/RoomCard";
import RoomDetail from "@/components/rooms/RoomDetail";
import RoomCardSkeleton from "@/components/rooms/RoomCardSkeleton";
import RoomSearchBar from "@/components/rooms/RoomSearchBar";

import { getAll } from "@/app/api/room.api";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { RoomResponseDto } from "@/types/room";

import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function RoomList() {
    const [rooms, setRooms] = useState<RoomResponseDto[]>([]);
    const [allRooms, setAllRooms] = useState<RoomResponseDto[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    // null: chưa mở chi tiết phòng
    const [selectedRoomId, setSelectedRoomId] =
        useState<number | null>(null);

    const {
        loading,
        error,
        handleSubmit,
    } = useFormSubmit<void, RoomResponseDto[]>(
        () => getAll(),
        {
            onSuccess: (data) => {
                setRooms(data);
                setAllRooms(data);
                setCurrentPage(1);
            },
        },
    );

    useEffect(() => {
        void handleSubmit(undefined);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredRooms = useMemo(() => {
        if (!Array.isArray(rooms)) return [];
        const query = search.trim().toLocaleLowerCase("vi");

        return rooms.filter((room) => {
            const searchableText = [
                room.roomName ?? "",
                room.roomTypeName ?? "",
                room.location ?? "",
            ]
                .join(" ")
                .toLocaleLowerCase("vi");

            return !query || searchableText.includes(query);
        });
    }, [rooms, search]);

    const totalPages = Math.ceil(
        filteredRooms.length / PAGE_SIZE,
    );

    const paginatedRooms = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;

        return filteredRooms.slice(
            startIndex,
            startIndex + PAGE_SIZE,
        );
    }, [filteredRooms, currentPage]);

    function changePage(page: number) {
        setCurrentPage(
            Math.min(Math.max(page, 1), Math.max(totalPages, 1)),
        );
    }

    // Đóng phần chi tiết phòng
    function closeRoomDetail() {
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

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from(
                        { length: PAGE_SIZE },
                        (_, index) => (
                            <RoomCardSkeleton key={index} />
                        ),
                    )}
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

                <p className="mt-2 text-sm text-muted-foreground">
                    {error}
                </p>

                <Button
                    type="button"
                    onClick={() => void handleSubmit(undefined)}
                    className="mt-4"
                >
                    Thử lại
                </Button>
            </div>
        );
    }

    return (
        <section
            className={`
                grid grid-cols-1 items-start gap-6
                ${
                    selectedRoomId !== null
                        ? "lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] lg:h-[calc(100dvh-8rem)] lg:min-h-0 lg:overflow-hidden"
                        : "w-full"
                }
            `}
        >
            {/* CỘT TRÁI: DANH SÁCH PHÒNG */}
            <div
                className={`
                    min-w-0
                    ${
                        selectedRoomId !== null
                            ? "lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-2"
                            : "w-full"
                    }
                `}
            >
                <div className="mb-5 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold">
                        Danh sách phòng
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        {filteredRooms.length} phòng
                    </p>
                </div>

                {/* TÌM KIẾM */}
                <div className="mb-5">
                    <Input
                        aria-label="Tìm phòng"
                        placeholder="Tìm theo tên phòng, loại phòng hoặc vị trí"
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {/* BỘ LỌC PHÒNG */}
                <div className="mb-6">
                    <RoomSearchBar
                        rooms={allRooms}
                        onResults={(results) => {
                            setRooms(results);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {/* DANH SÁCH */}
                {rooms.length === 0 ? (
                    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
                        <BedDouble className="size-12 text-muted-foreground/50" />

                        <h2 className="mt-4 text-lg font-semibold">
                            Chưa có phòng nào
                        </h2>
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
                        Không tìm thấy phòng phù hợp với bộ lọc.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {paginatedRooms.map((room) => (
                            <RoomCard
                                key={room.roomId}
                                room={room}
                                onSelect={setSelectedRoomId}
                                isSelected={
                                    selectedRoomId === room.roomId
                                }
                            />
                        ))}
                    </div>
                )}

                {/* PHÂN TRANG */}
                {totalPages > 1 && (
                    <nav
                        aria-label="Phân trang danh sách phòng"
                        className="mt-8 flex flex-wrap items-center justify-center gap-2"
                    >
                        <Button
                            type="button"
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() =>
                                changePage(currentPage - 1)
                            }
                        >
                            <ChevronLeft className="size-4" />
                            Trước
                        </Button>

                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1,
                        ).map((page) => (
                            <Button
                                key={page}
                                type="button"
                                variant={
                                    currentPage === page
                                        ? "default"
                                        : "outline"
                                }
                                aria-current={
                                    currentPage === page
                                        ? "page"
                                        : undefined
                                }
                                onClick={() => changePage(page)}
                                className="size-10"
                            >
                                {page}
                            </Button>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                changePage(currentPage + 1)
                            }
                        >
                            Sau
                            <ChevronRight className="size-4" />
                        </Button>
                    </nav>
                )}
            </div>

            {/* CỘT PHẢI: CHỈ HIỆN KHI CHỌN PHÒNG */}
            {selectedRoomId !== null && (
                <aside
                    aria-label="Chi tiết phòng"
                    className="min-w-0 rounded-2xl border bg-card shadow-sm lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain"
                >
                    {/* HEADER CHI TIẾT */}
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card/95 px-4 py-3 backdrop-blur">
                        <h2 className="font-semibold">
                            Chi tiết phòng
                        </h2>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={closeRoomDetail}
                            aria-label="Đóng chi tiết phòng"
                            title="Đóng chi tiết phòng"
                        >
                            <X className="size-5" />
                        </Button>
                    </div>

                    {/* NỘI DUNG CHI TIẾT */}
                    <div className="p-5">
                        <RoomDetail
                            key={selectedRoomId}
                            roomId={selectedRoomId}
                        />
                    </div>
                </aside>
            )}
        </section>
    );
}
