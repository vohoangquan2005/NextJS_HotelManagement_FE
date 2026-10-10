"use client";

import React from "react";
import { Search, Plus, Filter, Mail, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminCustomerPage() {
  const users = [
    {
      id: 1,
      name: "Nguyễn Văn Hùng",
      email: "hung.nguyen@example.com",
      phone: "0912345678",
      role: "Customer",
      status: "Active",
      createdAt: "15/01/2026",
    },
    {
      id: 2,
      name: "Trần Thị Mai",
      email: "mai.tran@example.com",
      phone: "0987654321",
      role: "Customer",
      status: "Active",
      createdAt: "20/02/2026",
    },
    {
      id: 3,
      name: "Lê Hoàng Long (Lễ tân ca 1)",
      email: "staff1@hotel.com",
      phone: "0909112233",
      role: "Staff",
      status: "Active",
      createdAt: "01/01/2026",
    },
    {
      id: 4,
      name: "Phạm Quốc Bảo (Admin)",
      email: "admin@hotel.com",
      phone: "0909998877",
      role: "Admin",
      status: "Active",
      createdAt: "01/01/2026",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Quản lý Người dùng & Khách hàng
          </h1>
          <p className="text-sm text-muted-foreground">
            Danh sách tài khoản thuộc các vai trò Admin, Staff và Customer trong hệ thống
          </p>
        </div>

        <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="size-4" />
          Thêm người dùng mới
        </Button>
      </div>

      <Card className="shadow-xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm theo tên, email, SĐT..."
              className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-sm text-foreground outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Filter className="size-3.5" />
              Lọc theo vai trò
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b">
                <tr>
                  <th className="px-4 py-3">Họ và tên</th>
                  <th className="px-4 py-3">Liên hệ</th>
                  <th className="px-4 py-3">Vai trò</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs sm:text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition">
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {u.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 text-foreground">
                          <Mail className="size-3 text-muted-foreground" /> {u.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="size-3 text-muted-foreground" /> {u.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          u.role === "Admin"
                            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            : u.role === "Staff"
                            ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                            : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        }`}
                      >
                        <Shield className="size-3" />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {u.createdAt}
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
