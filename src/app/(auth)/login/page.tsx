import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8 text-sm text-muted-foreground">Đang tải biểu mẫu...</div>}>
      <LoginForm />
    </Suspense>
  );
}
