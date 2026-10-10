"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BedDouble,
  BarChart3,
  CalendarDays,
  Receipt,
  Tag,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Hotel,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminNavItems: NavItem[] = [
  {
    title: "Tổng quan",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Người dùng & Khách",
    href: "/admin/customer",
    icon: Users,
  },
  {
    title: "Danh mục phòng",
    href: "/admin/rooms",
    icon: BedDouble,
  },
  {
    title: "Quản lý đặt phòng",
    href: "/admin/bookings",
    icon: CalendarDays,
  },
  {
    title: "Hóa đơn & Thu chi",
    href: "/admin/invoices",
    icon: Receipt,
  },
  {
    title: "Báo cáo thống kê",
    href: "/admin/statistics",
    icon: BarChart3,
  },
  {
    title: "Chương trình khuyến mãi",
    href: "/admin/promotions",
    icon: Tag,
  },
  {
    title: "Nhật ký hệ thống",
    href: "/admin/audit-logs",
    icon: ShieldCheck,
  },
];

interface AdminSidebarProps {
  onItemClick?: () => void;
}

export default function AdminSidebar({ onItemClick }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col border-r bg-card transition-all duration-300 ${collapsed ? "w-20" : "w-64"
        }`}
    >
      {/* Header của Sidebar */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link
          href="/"
          className={`flex items-center gap-2.5 font-bold overflow-hidden transition-all ${collapsed ? "justify-center w-full" : ""
            }`}
          title="HotelStay Admin"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
            <Hotel className="size-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground">
                HotelStay
              </span>
              <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest">
                Quản trị viên
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Nút thu gọn / mở rộng (Desktop) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 hidden md:flex size-6 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm hover:text-foreground transition hover:bg-accent"
        aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="size-3.5" />
        ) : (
          <ChevronLeft className="size-3.5" />
        )}
      </button>

      {/* Menu danh sách chức năng */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="mb-2 px-2">
          {!collapsed && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Chức năng quản trị
            </span>
          )}
        </div>

        <nav className="space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                title={collapsed ? item.title : undefined}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  } ${collapsed ? "justify-center px-2" : ""}`}
              >
                <Icon
                  className={`size-5 shrink-0 transition-transform ${isActive ? "scale-105" : "group-hover:scale-105"
                    }`}
                />
                {!collapsed && (
                  <span className="truncate">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Phần chân Sidebar: Thông tin người dùng & Đăng xuất */}
      <div className="border-t p-3">
        <div
          className={`flex items-center gap-3 rounded-xl bg-muted/50 p-2.5 ${collapsed ? "justify-center" : ""
            }`}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-600/10 text-amber-600 font-bold text-xs">
            {user?.fullName?.charAt(0).toUpperCase() || "A"}
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {user?.fullName || "Admin"}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {user?.email || "admin@hotel.com"}
              </p>
            </div>
          )}

          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout()}
              title="Đăng xuất"
              className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
