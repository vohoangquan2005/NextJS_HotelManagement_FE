import Link from "next/link";
import { BedDouble, Sparkles, Clock, ArrowRight, Star, Coffee, Wifi, Car } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  const featuredRooms = [
    {
      title: "Deluxe Ocean View",
      type: "Phòng đôi cao cấp",
      price: "1.450.000 ₫",
      rating: 4.9,
      features: ["Giường King-size", "Ban công ngắm biển", "Bữa sáng miễn phí"],
    },
    {
      title: "Executive Luxury Suite",
      type: "Căn hộ VIP",
      price: "2.800.000 ₫",
      rating: 5.0,
      features: ["Phòng khách riêng", "Bồn tắm sục Jacuzzi", "Dịch vụ phòng 24/7"],
    },
    {
      title: "Standard Comfort King",
      type: "Phòng đơn tiêu chuẩn",
      price: "850.000 ₫",
      rating: 4.8,
      features: ["Giường êm ái", "Wifi tốc độ cao", "Smart TV 55 inch"],
    },
  ];

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            Khám phá kỳ nghỉ hoàn hảo cùng HotelStay
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Trải Nghiệm Nghỉ Dưỡng <br />
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent">
              Sang Trọng & Đẳng Cấp
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Hệ thống phòng nghỉ tiện nghi chuẩn 5 sao, dịch vụ chu đáo tận tâm
            và quy trình đặt phòng trực tuyến tức thì, an toàn tuyệt đối.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/rooms"
              className={buttonVariants({ size: "lg", className: "text-base px-8 shadow-md" })}
            >
              Khám phá phòng nghỉ
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="/service"
              className={buttonVariants({ variant: "outline", size: "lg", className: "text-base px-8" })}
            >
              Xem dịch vụ khách sạn
            </Link>
          </div>

          {/* Tiện ích nổi bật */}
          <div className="mt-14 grid grid-cols-2 gap-4 border-y py-6 text-left sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Wifi className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tốc độ cao</p>
                <p className="text-sm font-bold">Wifi miễn phí</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Coffee className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ẩm thực</p>
                <p className="text-sm font-bold">Buffet sáng cao cấp</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Hỗ trợ</p>
                <p className="text-sm font-bold">Lễ tân trực 24/7</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Car className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Bãi đỗ xe</p>
                <p className="text-sm font-bold">Đưa đón sân bay</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phòng nghỉ nổi bật */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Không gian nghỉ dưỡng
            </span>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
              Phòng Nghỉ Được Yêu Thích Nhất
            </h2>
          </div>
          <Link
            href="/rooms"
            className={buttonVariants({ variant: "outline" })}
          >
            Xem tất cả phòng
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredRooms.map((room) => (
            <div
              key={room.title}
              className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-xs transition hover:shadow-lg"
            >
              {/* Vùng hình ảnh demo */}
              <div className="relative flex h-48 w-full items-center justify-center bg-muted text-muted-foreground">
                <BedDouble className="size-12 opacity-50" />
                <span className="absolute bottom-3 left-3 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-xs font-medium text-foreground flex items-center gap-1 shadow-xs">
                  <Star className="size-3.5 fill-amber-500 text-amber-500" />
                  {room.rating}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  {room.type}
                </span>
                <h3 className="mt-1 text-xl font-bold text-foreground">
                  {room.title}
                </h3>

                <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  {room.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Chỉ từ</span>
                    <p className="text-lg font-bold text-primary">{room.price}</p>
                  </div>
                  <Link
                    href="/rooms"
                    className={buttonVariants({ size: "sm" })}
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}