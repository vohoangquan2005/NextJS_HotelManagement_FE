import Link from "next/link";
import {
    Hotel,
    MapPin,
    Phone,
    Mail,
    ArrowUpRight,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

const quickLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Phòng nghỉ", href: "/rooms" },
    { label: "Dịch vụ", href: "/services" },
    { label: "Liên hệ", href: "/contact" },
];

export default function PublicFooter() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {/* Cột 1: Thương hiệu */}
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2"
                            aria-label="HotelStay - Trang chủ"
                        >
                            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                                <Hotel className="size-6 text-primary" />
                            </span>

                            <span className="text-xl font-bold tracking-tight">
                                HotelStay
                            </span>
                        </Link>

                        <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">
                            Mang đến không gian nghỉ ngơi thoải mái, dịch vụ chu đáo
                            và trải nghiệm chắc chắn sẽ quên cho mỗi lần đăng xuất.
                        </p>
                    </div>

                    {/* Cột 2: Khám phá - dùng mảng dữ liệu */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider">
                            Khám phá
                        </h2>

                        <ul className="mt-5 space-y-4">
                            {quickLinks.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ trợ - viết cứng */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider">
                            Hỗ trợ khách hàng
                        </h2>

                        <ul className="mt-5 space-y-4">
                            <li>
                                <Link
                                    href="/faq"
                                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Câu hỏi thường gặp
                                    <ArrowUpRight className="size-3" />
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/booking-policy"
                                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Chính sách đặt phòng
                                    <ArrowUpRight className="size-3" />
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/privacy-policy"
                                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Chính sách bảo mật
                                    <ArrowUpRight className="size-3" />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 4: Liên hệ - viết cứng */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider">
                            Liên hệ
                        </h2>

                        <ul className="mt-5 space-y-5">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-1 size-4 shrink-0 text-primary" />
                                <div>
                                    <p className="text-sm font-medium">Địa chỉ</p>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        Tầng 18 - Âm phủ
                                    </p>
                                </div>
                            </li>

                            <li className="flex items-start gap-3">
                                <Phone className="mt-1 size-4 shrink-0 text-primary" />
                                <div className="space-y-4">
                                    <div>
                                        <a
                                            href="tel:0123456789"
                                            className="text-sm font-medium transition-colors hover:text-primary"
                                        >
                                            0123 456 789
                                        </a>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Diêm Tổng - Chủ tịch
                                        </p>
                                    </div>

                                    <div>
                                        <a
                                            href="tel:0123123123"
                                            className="text-sm font-medium transition-colors hover:text-primary"
                                        >
                                            0123 123 123
                                        </a>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Mạnh Tổng - Trưởng phòng Quên lãng
                                        </p>
                                    </div>

                                    <div>
                                        <a
                                            href="tel:0456456456"
                                            className="text-sm font-medium transition-colors hover:text-primary"
                                        >
                                            0456 456 456
                                        </a>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Hắc Tổng &amp; Bạch Tổng - Dẫn đường tận nơi
                                        </p>
                                    </div>
                                </div>
                            </li>

                            <li className="flex items-start gap-3">
                                <Mail className="mt-1 size-4 shrink-0 text-primary" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium">Email</p>
                                    <a
                                        href="mailto:diaphu@hotelstay.vn"
                                        className="mt-1 block break-all text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        diaphu@hotelstay.vn
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Dòng cuối footer */}
                <div className="flex flex-col gap-3 text-center text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
                    <p>
                        © {new Date().getFullYear()} HotelStay. All rights reserved.
                    </p>

                    <p>Được xây dựng với sự tận tâm dành cho khách hàng.</p>
                </div>
            </div>
        </footer>
    );
}
