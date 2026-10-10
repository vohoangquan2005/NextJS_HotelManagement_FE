import React from "react";
import StaffSidebar from "@/components/layout/StaffSidebar";
import StaffHeader from "@/components/layout/StaffHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export const metadata = {
  title: "Nhân viên Vận hành | HotelStay",
  description: "Trang dành cho nhân viên lễ tân và vận hành HotelStay",
};

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["Staff", "Admin"]}>
      <div className="flex min-h-screen bg-muted/20">
        {/* Sidebar cố định trên desktop */}
        <div className="hidden md:flex">
          <StaffSidebar />
        </div>

        {/* Nội dung chính */}
        <div className="flex flex-1 flex-col min-w-0">
          <StaffHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
