"use client";

import React from "react";
import Link from "next/link";
import { CalendarCheck, BedDouble, Calendar, Clock } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function MyBookingsPage() {
  const { user } = useAuth();

  const myBookings = [
    {
      id: "BK-8821",
      room: "Phòng Deluxe King Ban Công Biển (Phòng 302)",
      checkIn: "15/10/2026",
      checkOut: "18/10/2026",
      guests: "2 Người lớn",
      totalPrice: "4.350.000 ₫",
      status: "Đã xác nhận",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      id: "BK-7612",
      room: "Phòng Standard Giường Đôi Tiện Nghi (Phòng 201)",
      checkIn: "02/09/2026",
      checkOut: "04/09/2026",
      guests: "2 Người lớn",
      totalPrice: "1.700.000 ₫",
      status: "Đã hoàn thành",
      statusColor: "text-muted-foreground bg-muted border-border",
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["Customer", "Staff", "Admin"]}>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Lịch Sử Đặt Phòng Của Tôi
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Quản lý các chuyến đi và phòng đã đặt của tài khoản{" "}
              <span className="font-semibold text-foreground">{user?.fullName}</span>
            </p>
          </div>

          <Link
            href="/rooms"
            className={buttonVariants({ variant: "default" })}
          >
            Đặt thêm phòng mới
          </Link>
        </div>

        <div className="space-y-4">
          {myBookings.map((b) => (
            <Card key={b.id} className="shadow-xs overflow-hidden">
              <CardHeader className="bg-muted/30 pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="size-5 text-primary" />
                  <CardTitle className="text-sm font-bold font-mono">
                    Mã đặt phòng: {b.id}
                  </CardTitle>
                </div>
                <span
                  className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${b.statusColor}`}
                >
                  {b.status}
                </span>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-base font-bold text-foreground flex items-center gap-2">
                      <BedDouble className="size-4 text-muted-foreground" />
                      {b.room}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Số lượng khách: {b.guests}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">Tổng tiền thanh toán</span>
                    <p className="text-lg font-bold text-primary">{b.totalPrice}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 rounded-lg bg-muted/20 p-3 text-xs text-muted-foreground border">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Calendar className="size-3.5 text-primary" />
                    Nhận phòng: {b.checkIn}
                  </span>
                  <span>→</span>
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Clock className="size-3.5 text-primary" />
                    Trả phòng: {b.checkOut}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
