"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, ExternalLink, LogOut, ShieldCheck, User } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "./AdminSidebar";

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      {/* Mobile Drawer trigger */}
      <div className="flex items-center gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Mở danh mục quản trị"
              >
                <Menu className="size-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="p-0 w-64">
            <AdminSidebar onItemClick={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 sm:inline-flex items-center gap-1 dark:text-amber-400">
            <ShieldCheck className="size-3.5" />
            Bảng điều khiển Quản trị viên
          </span>
        </div>
      </div>

      {/* Hành động trên Header */}
      <div className="flex items-center gap-3">
        {/* Nút xem website công khai */}
        <Link
          href="/"
          target="_blank"
          className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-1.5 text-xs" })}
        >
          <ExternalLink className="size-3.5" />
          <span className="hidden sm:inline">Xem trang khách</span>
        </Link>

        {/* Thông tin tài khoản */}
        <div className="hidden sm:flex items-center gap-2 text-right">
          <div className="text-xs">
            <p className="font-semibold text-foreground">
              {user?.fullName || "Admin"}
            </p>
            <p className="text-[10px] text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex size-8 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-xs">
            <User className="size-4" />
          </div>
        </div>

        {/* Nút Đăng xuất */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => logout()}
          className="gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40 cursor-pointer"
        >
          <LogOut className="size-3.5" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </Button>
      </div>
    </header>
  );
}
