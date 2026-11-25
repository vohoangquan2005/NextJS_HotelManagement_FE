import PublicSiteLayout from "@/components/layout/PublicSiteLayout";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <PublicSiteLayout>{children}</PublicSiteLayout>;
}
