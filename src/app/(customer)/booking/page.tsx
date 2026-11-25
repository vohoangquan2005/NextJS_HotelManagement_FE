import OnlineBookingForm from "@/components/booking/OnlineBookingForm";
import { Suspense } from "react";

export default function OnlineBookingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Đang tải biểu mẫu đặt phòng…</div>}>
      <OnlineBookingForm />
    </Suspense>
  );
}
