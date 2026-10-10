import { Skeleton } from "@/components/ui/skeleton";

export default function RoomCardSkeleton() {
    return (
        <div
            className="w-full overflow-hidden rounded-2xl border bg-card"
            aria-hidden="true"
        >
            {/* Ảnh phòng */}
            <Skeleton className="h-44 w-full rounded-none" />

            <div className="p-5">
                {/* Loại phòng */}
                <Skeleton className="h-4 w-24" />

                {/* Tên phòng */}
                <Skeleton className="mt-3 h-6 w-3/4" />

                {/* Địa điểm */}
                <div className="mt-3 flex items-center gap-2">
                    <Skeleton className="size-4 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Sức chứa */}
                <div className="mt-3 flex items-center gap-2">
                    <Skeleton className="size-4 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                </div>

                {/* Giá và nút chi tiết */}
                <div className="mt-5 flex items-end justify-between border-t pt-4">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-6 w-28" />
                    </div>

                    <Skeleton className="h-9 w-24 rounded-md" />
                </div>
            </div>
        </div>
    );
}
