import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BannerForm() {
    return (
        <section className="relative isolate flex min-h-[420px] items-center overflow-hidden bg-slate-900 md:min-h-[500px]">
            {/* Ảnh nền */}
            <div
                className="absolute inset-0 -z-20 bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2000&q=85')",
                }}
            />

            {/* Lớp phủ giúp nội dung dễ đọc */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/10" />

            <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="max-w-2xl space-y-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                        Chào mừng đến với khách sạn của chúng tôi
                    </p>

                    <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Tận hưởng kỳ nghỉ
                        <span className="block text-blue-200">
                            theo cách của bạn
                        </span>
                    </h1>

                    <p className="max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
                        Khám phá những căn phòng tiện nghi, không gian thư giãn
                        và trải nghiệm lưu trú đáng nhớ cho chuyến đi tiếp theo.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <Link
                            href="/room"
                            className={cn(
                                buttonVariants({ size: "lg" }),
                                "bg-blue-600 text-white hover:bg-blue-700"
                            )}
                        >
                            Khám phá phòng
                            <ArrowRight className="ml-2 size-4" />
                        </Link>

                        <Link
                            href="/room"
                            className={cn(
                                buttonVariants({ variant: "outline", size: "lg" }),
                                "border-white/70 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                            )}
                        >
                            Xem tất cả phòng
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
