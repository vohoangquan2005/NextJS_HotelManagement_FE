import React from "react";
import { Utensils, Waves, Dumbbell, Sparkles, Car, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Dịch vụ khách sạn | HotelStay",
  description: "Các dịch vụ và tiện ích đẳng cấp dành cho quý khách tại HotelStay",
};

export default function ServicesPage() {
  const services = [
    {
      title: "Nhà hàng ẩm thực Á - Âu",
      description: "Thực đơn đa dạng do đầu bếp chuẩn quốc tế chế biến, phục vụ buffet sáng và tiệc tối lãng mạn.",
      icon: Utensils,
      color: "text-amber-600 bg-amber-500/10",
      hours: "06:00 - 22:30",
    },
    {
      title: "Hồ bơi vô cực ngắm biển",
      description: "Nước ấm điều hòa nhiệt độ quanh năm, quầy bar bên hồ bơi phục vụ cocktail nhiệt đới.",
      icon: Waves,
      color: "text-blue-600 bg-blue-500/10",
      hours: "06:00 - 21:00",
    },
    {
      title: "Spa & Massage Thư Giãn",
      description: "Liệu trình trị liệu thảo dược tự nhiên, xông hơi đá muối Himalaya giúp tái tạo năng lượng.",
      icon: Sparkles,
      color: "text-emerald-600 bg-emerald-500/10",
      hours: "09:00 - 22:00",
    },
    {
      title: "Phòng Gym & Thể Hình Hiện Đại",
      description: "Trang thiết bị tập luyện Technogym tiên tiến, có huấn luyện viên hướng dẫn cá nhân theo yêu cầu.",
      icon: Dumbbell,
      color: "text-purple-600 bg-purple-500/10",
      hours: "Mở cửa 24/7",
    },
    {
      title: "Xe đưa đón sân bay & Thuê xe",
      description: "Dàn xe limousine sang trọng đưa đón khách tận nơi, an toàn, nhanh chóng và đúng giờ.",
      icon: Car,
      color: "text-rose-600 bg-rose-500/10",
      hours: "Phục vụ theo lịch hẹn",
    },
    {
      title: "Dịch vụ giặt ủi lấy nhanh",
      description: "Giặt sấy khô và ủi phẳng trang phục bằng công nghệ bảo vệ sợi vải cao cấp trong 4 tiếng.",
      icon: ShieldCheck,
      color: "text-sky-600 bg-sky-500/10",
      hours: "07:00 - 20:00",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Dịch Vụ & Tiện Ích Đẳng Cấp
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Tận hưởng kỳ nghỉ trọn vẹn với các dịch vụ chăm sóc và trải nghiệm được thiết kế riêng cho bạn tại HotelStay.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className="shadow-xs transition hover:shadow-md">
              <CardHeader>
                <div className={`mb-3 flex size-12 items-center justify-center rounded-xl ${s.color}`}>
                  <Icon className="size-6" />
                </div>
                <CardTitle className="text-lg font-bold">{s.title}</CardTitle>
                <span className="text-xs font-semibold text-muted-foreground">
                  Thời gian: {s.hours}
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
