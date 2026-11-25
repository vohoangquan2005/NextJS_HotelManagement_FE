"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    FileText,
    Heart,
    Hotel,
    LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const items = [
    { title: "Đặt phòng", href: "/booking", icon: CalendarDays },
    { title: "Đặt phòng của tôi", href: "/bookings", icon: CalendarDays },
    { title: "Thanh toán", href: "/payments", icon: CreditCard },
    { title: "Hóa đơn", href: "/invoices", icon: FileText },
    { title: "Phòng yêu thích", href: "/favorites", icon: Heart },
];

export default function CustomerSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`relative flex shrink-0 flex-col border-b bg-card transition-all duration-300 md:min-h-[calc(100vh-4rem)] md:border-b-0 md:border-r ${
                collapsed ? "md:w-20" : "md:w-64"
            }`}
        >
            <div className="hidden h-16 items-center border-b px-4 md:flex">
                <Link
                    href="/"
                    title="HellStay Khách hàng"
                    className={`flex items-center gap-2.5 overflow-hidden font-bold ${collapsed ? "w-full justify-center" : ""}`}
                >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                        <Hotel className="size-5" />
                    </span>
                    {!collapsed && (
                        <span className="flex flex-col">
                            <span className="text-base tracking-tight">HellStay</span>
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                                Khách hàng
                            </span>
                        </span>
                    )}
                </Link>
            </div>

            <button
                type="button"
                onClick={() => setCollapsed((value) => !value)}
                className="absolute -right-3 top-20 z-10 hidden size-6 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition hover:bg-accent hover:text-foreground md:flex"
                aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            >
                {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
            </button>

            <div className="flex-1 overflow-x-auto p-2 md:overflow-x-hidden md:overflow-y-auto md:px-3 md:py-4">
                <p className="mb-2 hidden px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:block">
                    {!collapsed && "Tài khoản của tôi"}
                </p>
                <nav aria-label="Điều hướng khách hàng" className="flex gap-1 md:flex-col">
                    {items.map(({ title, href, icon: Icon }) => {
                        const active = pathname === href || pathname.startsWith(`${href}/`);
                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={active ? "page" : undefined}
                                title={collapsed ? title : undefined}
                                className={`group flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-primary text-primary-foreground shadow-xs"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                } ${collapsed ? "md:justify-center md:px-2" : ""}`}
                            >
                                <Icon className="size-5 shrink-0 transition-transform group-hover:scale-105" />
                                <span className={`whitespace-nowrap ${collapsed ? "md:hidden" : ""}`}>
                                    {title}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="hidden border-t p-3 md:block">
                {!collapsed && (
                    <p className="mb-3 truncate rounded-lg bg-muted/50 px-3 py-2 text-sm font-medium">
                        {user?.fullName || "Khách hàng"}
                    </p>
                )}
                <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 text-muted-foreground hover:text-destructive ${collapsed ? "px-2 md:justify-center" : ""}`}
                    onClick={() => void logout()}
                    aria-label="Đăng xuất"
                    title={collapsed ? "Đăng xuất" : undefined}
                >
                    <LogOut className="size-5 shrink-0" />
                    {!collapsed && <span>Đăng xuất</span>}
                </Button>
            </div>
        </aside>
    );
}
