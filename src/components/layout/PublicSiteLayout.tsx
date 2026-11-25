"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import CustomerSidebar from "@/components/layout/CustomerSidebar";

export default function PublicSiteLayout({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    const showCustomerSidebar = !isLoading && user?.roleName.toLowerCase() === "customer";

    return (
        <div className="flex min-h-screen flex-col">
            <PublicHeader />
            <div className="flex flex-1 flex-col md:flex-row">
                {showCustomerSidebar && <CustomerSidebar />}
                <main className="min-w-0 flex-1">{children}</main>
            </div>
            <PublicFooter />
        </div>
    );
}
