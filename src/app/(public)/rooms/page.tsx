import React from "react";
import Link from "next/link";
import { BedDouble, Users, Maximize2, Star } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Danh sách phòng nghỉ | HotelStay",
  description: "Khám phá các loại phòng nghỉ sang trọng, tiện nghi tại HotelStay",
};

export default function RoomsPage() {
  const rooms = [
    {
      id: 1,
      name: "Phòng Deluxe King Ban Công Biển",
      type: "Deluxe",
      capacity: "2 người lớn, 1 trẻ em",
      area: "38 m²",
      price: "1.450.000 ₫/đêm",
      rating: 4.9,
      amenities: ["Ban công riêng", "Bữa sáng buffet", "Wifi tốc độ cao", "Bồn tắm nằm"],
    },
    {
      id: 2,
      name: "Phòng Executive Suite Sang Trọng",
      type: "Suite",
      capacity: "4 người lớn",
      area: "65 m²",
      price: "2.850.000 ₫/đêm",
      rating: 5.0,
      amenities: ["Phòng khách tách biệt", "Bồn sục Jacuzzi", "Mini-bar miễn phí", "Check-in ưu tiên"],
    },
    {
      id: 3,
      name: "Phòng Standard Giường Đôi Tiện Nghi",
      type: "Standard",
      capacity: "2 người lớn",
      area: "28 m²",
      price: "850.000 ₫/đêm",
      rating: 4.8,
      amenities: ["Smart TV 55 inch", "Máy pha trà/cà phê", "Điều hòa hai chiều", "Bàn làm việc"],
    },
    {
      id: 4,
      name: "Phòng Family Suite Gia Đình",
      type: "Family",
      capacity: "4-5 người lớn",
      area: "52 m²",
      price: "2.100.000 ₫/đêm",
      rating: 4.9,
      amenities: ["2 giường Queen-size", "Khu vui chơi trẻ em", "Tủ lạnh lớn", "2 phòng tắm riêng"],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Danh Sách Phòng Nghỉ & Suites
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Được thiết kế tinh tế với đầy đủ tiện nghi tiêu chuẩn 5 sao, mang đến trải nghiệm nghỉ ngơi thư thái nhất cho quý khách.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-xs transition hover:shadow-lg"
          >
            {/* Hình ảnh demo */}
            <div className="relative flex h-60 w-full items-center justify-center bg-muted text-muted-foreground">
              <BedDouble className="size-16 opacity-40" />
              <div className="absolute top-4 left-4 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-semibold text-primary">
                {room.type}
              </div>
              <div className="absolute bottom-4 right-4 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-xs font-medium text-foreground flex items-center gap-1 shadow-xs">
                <Star className="size-3.5 fill-amber-500 text-amber-500" />
                {room.rating}
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h2 className="text-xl font-bold text-foreground">{room.name}</h2>

              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="size-3.5" />
                  {room.capacity}
                </span>
                <span className="flex items-center gap-1">
                  <Maximize2 className="size-3.5" />
                  {room.area}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {room.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {a}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <div>
                  <span className="text-xs text-muted-foreground">Giá mỗi đêm</span>
                  <p className="text-xl font-bold text-primary">{room.price}</p>
                </div>
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "default" })}
                >
                  Đặt phòng ngay
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
