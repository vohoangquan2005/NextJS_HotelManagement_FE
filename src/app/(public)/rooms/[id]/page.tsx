import React from "react";
import Link from "next/link";
import { BedDouble, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface RoomDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Link
          href="/rooms"
          className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-4 gap-2" })}
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách phòng
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Chi Tiết Phòng Nghỉ #{id}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Thông tin chi tiết về tiện ích, không gian và bảng giá đặt phòng.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex h-72 w-full items-center justify-center bg-muted text-muted-foreground">
          <BedDouble className="size-20 opacity-40" />
        </div>
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
            <div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Hạng Phòng Cao Cấp
              </span>
              <h2 className="mt-2 text-2xl font-bold text-foreground">
                Deluxe Ocean View #{id}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-muted-foreground">Giá ưu đãi</span>
              <p className="text-2xl font-bold text-primary">1.450.000 ₫/đêm</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 border-b pb-6 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Sức chứa</p>
              <p className="font-semibold text-foreground mt-0.5">2 Người lớn, 1 trẻ em</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Diện tích</p>
              <p className="font-semibold text-foreground mt-0.5">38 m²</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Loại giường</p>
              <p className="font-semibold text-foreground mt-0.5">1 Giường King-size</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Đánh giá</p>
              <p className="font-semibold text-amber-600 mt-0.5">4.9 / 5.0 (Tuyệt vời)</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/rooms"
              className={buttonVariants({ variant: "outline" })}
            >
              Xem phòng khác
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "default" })}
            >
              Tiến hành đặt phòng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
