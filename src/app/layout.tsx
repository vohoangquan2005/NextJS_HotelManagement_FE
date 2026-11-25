import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ApiErrorToaster } from "@/components/common/ApiErrorToaster";

export const metadata: Metadata = {
  title: {
    default: "HellStay - Hệ Thống Quản Lý & Đặt Phòng Khách Sạn",
    template: "%s | HellStay",
  },
  description: "Website quản lý và đặt phòng khách sạn thông minh, tiện ích và hiện đại.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
        <AuthProvider>
          {children}
          <ApiErrorToaster />
        </AuthProvider>
      </body>
    </html>
  );
}
