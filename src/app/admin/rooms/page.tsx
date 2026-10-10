"use client";

import React from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminRoomsPage() {
  const rooms = [
    {
      id: "101",
      name: "Phòng 101",
      type: "Standard King",
      price: "850.000 ₫/đêm",
      status: "Sẵn sàng",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      id: "201",
      name: "Phòng 201",
      type: "Deluxe Twin",
      price: "1.250.000 ₫/đêm",
      status: "Đang có khách",
      statusColor: "text-blue-700 bg-blue-50 border-blue-200",
    },
    {
      id: "305",
      name: "Phòng 305",
      type: "Suite Sea View",
      price: "2.100.000 ₫/đêm",
      status: "Đang dọn dẹp",
      statusColor: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      id: "402",
      name: "Phòng 402",
      type: "Executive Suite",
      price: "3.500.000 ₫/đêm",
      status: "Bảo trì",
      statusColor: "text-rose-700 bg-rose-50 border-rose-200",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Danh mục & Trạng thái Phòng
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản trị thông tin phòng nghỉ, phân loại phòng và tình trạng sử dụng
          </p>
        </div>

        <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="size-4" />
          Thêm phòng mới
        </Button>
      </div>

      <Card className="shadow-xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm số phòng, loại phòng..."
              className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-sm text-foreground outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Filter className="size-3.5" />
              Lọc theo tầng / loại
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b">
                <tr>
                  <th className="px-4 py-3">Số phòng</th>
                  <th className="px-4 py-3">Loại phòng</th>
                  <th className="px-4 py-3">Giá niêm yết</th>
                  <th className="px-4 py-3">Tình trạng</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs sm:text-sm">
                {rooms.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition">
                    <td className="px-4 py-3 font-bold text-foreground">
                      {r.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.type}
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {r.price}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${r.statusColor}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
