import React from "react";
import Link from "next/link";
import { Hotel } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-between">
      {/* Header nhỏ gọn của auth */}
      <header className="w-full border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-foreground hover:opacity-90 transition"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Hotel className="size-5" />
            </div>
            <span>HotelStay</span>
          </Link>
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition"
          >
            Quay về trang chủ
          </Link>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center py-6 sm:py-10">
        {children}
      </main>

      {/* Footer nhỏ gọn */}
      <footer className="py-4 text-center text-xs text-muted-foreground border-t bg-background/50">
        © {new Date().getFullYear()} HotelStay. Hệ thống Quản Lý & Đặt Phòng Khách Sạn.
      </footer>
    </div>
  );
}
