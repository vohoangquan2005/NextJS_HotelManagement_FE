"use client";

import React from "react";
import {
  CalendarDays,
  Users,
  CheckCircle2,
  Clock,
  BedDouble,
  Receipt,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function StaffDashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Phòng đang có khách",
      value: "28/45",
      change: "Tỷ lệ lấp đầy: 62%",
      icon: BedDouble,
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      title: "Check-in hôm nay",
      value: "12",
      change: "4 khách đã nhận phòng",
      icon: Clock,
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      title: "Check-out hôm nay",
      value: "8",
      change: "6 phòng đã dọn xong",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      title: "Yêu cầu hủy phòng",
      value: "2",
      change: "Cần phản hồi sớm",
      icon: AlertCircle,
      color: "text-rose-600 bg-rose-500/10",
    },
  ];

  const recentBookings = [
    {
      id: "BK-1024",
      guest: "Nguyễn Văn Hùng",
      room: "Phòng 302 (Deluxe Double)",
      checkIn: "10/10/2026",
      status: "Đã xác nhận",
      statusColor: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      id: "BK-1025",
      guest: "Trần Thị Mai",
      room: "Phòng 405 (Suite Sea View)",
      checkIn: "10/10/2026",
      status: "Đã nhận phòng",
      statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      id: "BK-1026",
      guest: "Lê Hoàng Long",
      room: "Phòng 201 (Standard King)",
      checkIn: "11/10/2026",
      status: "Chờ thanh toán",
      statusColor: "text-amber-600 bg-amber-50 border-amber-200",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Lời chào */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Bảng điều khiển Nghiệp vụ Lễ tân
          </h1>
          <p className="text-sm text-muted-foreground">
            Xin chào, <span className="font-semibold text-foreground">{user?.fullName}</span>. Chúc bạn một ngày làm việc hiệu quả!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="size-4" />
            Tạo đặt phòng mới
          </Button>
        </div>
      </div>

      {/* Thẻ thống kê nhanh */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-xl p-2.5 ${stat.color}`}>
                  <Icon className="size-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Danh sách công việc và Đặt phòng gần đây */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Đặt phòng gần đây */}
        <Card className="lg:col-span-2 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">
                Đặt phòng sắp tới
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Danh sách khách đặt phòng dự kiến nhận trong hôm nay và ngày mai
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Xem tất cả
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y rounded-lg border">
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col gap-2 p-3.5 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/30 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        {b.guest}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        ({b.id})
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{b.room}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      Ngày nhận: {b.checkIn}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${b.statusColor}`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Thao tác nhanh */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold">Thao tác nhanh</CardTitle>
            <p className="text-xs text-muted-foreground">
              Các tác vụ thường dùng trong ca trực
            </p>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Button variant="outline" className="w-full justify-start gap-2.5 text-xs">
              <CalendarDays className="size-4 text-blue-600" />
              Tra cứu phòng trống
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2.5 text-xs">
              <Users className="size-4 text-emerald-600" />
              Đăng ký thông tin khách lưu trú
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2.5 text-xs">
              <Receipt className="size-4 text-amber-600" />
              Lập hóa đơn thanh toán
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2.5 text-xs">
              <Clock className="size-4 text-rose-600" />
              Gia hạn thời gian lưu trú
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
