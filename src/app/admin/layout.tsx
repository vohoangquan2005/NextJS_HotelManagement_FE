import React from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export const metadata = {
  title: "Quản trị viên | HotelStay",
  description: "Trang quản trị hệ thống khách sạn HotelStay",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <div className="flex min-h-screen bg-muted/20">
        {/* Sidebar cố định trên desktop */}
        <div className="hidden md:flex">
          <AdminSidebar />
        </div>

        {/* Nội dung chính */}
        <div className="flex flex-1 flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
