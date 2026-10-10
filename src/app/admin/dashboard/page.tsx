"use client";

import React from "react";
import {
  TrendingUp,
  Users,
  BedDouble,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const metrics = [
    {
      title: "Tổng doanh thu tháng",
      value: "148.500.000 ₫",
      change: "+12.4% so với tháng trước",
      icon: DollarSign,
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      title: "Tỷ lệ lấp đầy phòng",
      value: "78.2%",
      change: "+5.1% so với tuần trước",
      icon: TrendingUp,
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      title: "Tổng khách hàng đăng ký",
      value: "1,248",
      change: "+34 khách hàng mới tuần này",
      icon: Users,
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      title: "Tổng số phòng sẵn sàng",
      value: "42/45",
      change: "3 phòng đang bảo trì định kỳ",
      icon: BedDouble,
      color: "text-purple-600 bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Thông tin Quản trị */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Trung tâm Quản trị Khách sạn
            </h1>
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600">
              Admin Portal
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Xin chào Quản trị viên{" "}
            <span className="font-semibold text-foreground">{user?.fullName}</span>. Hệ thống hoạt động ổn định.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <Calendar className="size-3.5" />
            Hôm nay: {new Date().toLocaleDateString("vi-VN")}
          </Button>
        </div>
      </div>

      {/* Thẻ thống kê tổng quan */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.title} className="shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                  {m.title}
                </CardTitle>
                <div className={`rounded-xl p-2.5 ${m.color}`}>
                  <Icon className="size-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {m.value}
                </div>
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className="mr-1 size-3.5 text-emerald-600" />
                  <span>{m.change}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Danh mục giám sát */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Building2 className="size-4 text-amber-600" />
              Tình trạng phân bổ phòng khách sạn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Phòng Standard King (15 phòng)</span>
                <span className="text-muted-foreground">12/15 đang sử dụng (80%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "80%" }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Phòng Deluxe Sea View (20 phòng)</span>
                <span className="text-muted-foreground">16/20 đang sử dụng (80%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "80%" }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Phòng VIP Suite (10 phòng)</span>
                <span className="text-muted-foreground">7/10 đang sử dụng (70%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: "70%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600" />
              Nhật ký hệ thống gần đây (Audit Logs)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between border-b pb-2.5">
                <div>
                  <p className="font-semibold text-foreground">
                    Admin {user?.fullName} đăng nhập hệ thống
                  </p>
                  <p className="text-muted-foreground text-[11px]">Xác thực JWT phiên làm việc thành công</p>
                </div>
                <span className="text-muted-foreground">Vừa xong</span>
              </div>

              <div className="flex items-start justify-between border-b pb-2.5">
                <div>
                  <p className="font-semibold text-foreground">
                    Cập nhật bảng giá phòng Deluxe
                  </p>
                  <p className="text-muted-foreground text-[11px]">Điều chỉnh theo chính sách mùa cao điểm</p>
                </div>
                <span className="text-muted-foreground">1 giờ trước</span>
              </div>

              <div className="flex items-start justify-between pb-1">
                <div>
                  <p className="font-semibold text-foreground">
                    Tạo mới khuyến mãi: &quot;Hè Rực Rỡ 2026&quot;
                  </p>
                  <p className="text-muted-foreground text-[11px]">Giảm 15% cho đặt phòng từ 3 đêm</p>
                </div>
                <span className="text-muted-foreground">3 giờ trước</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
