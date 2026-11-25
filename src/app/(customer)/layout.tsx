import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicSiteLayout from "@/components/layout/PublicSiteLayout";

export default function CustomerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProtectedRoute allowedRoles={["Customer"]}>
            <PublicSiteLayout>{children}</PublicSiteLayout>
        </ProtectedRoute>
    );
}
