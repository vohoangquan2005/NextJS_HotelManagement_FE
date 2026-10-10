import { Skeleton } from "@/components/ui/skeleton";

export default function RoomDetailSkeleton() {
    return (
        <div className="space-y-6">
            {/* Ảnh phòng */}
            <Skeleton className="aspect-[16/10] w-full rounded-2xl" />

            {/* Tên phòng và địa điểm */}
            <div className="space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Giá phòng */}
            <div className="space-y-3 rounded-2xl border p-4">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-8 w-44" />
                <Skeleton className="h-3 w-32" />
            </div>

            {/* Thông tin phòng */}
            <div className="space-y-3">
                <Skeleton className="h-5 w-36" />

                <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-28 rounded-xl" />
                    <Skeleton className="h-28 rounded-xl" />
                </div>
            </div>

            {/* Mô tả */}
            <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-20 w-full rounded-xl" />
            </div>
        </div>
    );
}