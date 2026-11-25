"use client";

import { useEffect, useRef, useState } from "react";
import { CircleX, X } from "lucide-react";

type ApiErrorToast = {
  id: number;
  message: string;
  status: number;
};

type ApiErrorEvent = CustomEvent<{
  message: string;
  status: number;
}>;

export function ApiErrorToaster() {
  const [toasts, setToasts] = useState<ApiErrorToast[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const handleApiError = (event: Event) => {
      const { message, status } = (event as ApiErrorEvent).detail;
      const id = ++nextId.current;

      setToasts((current) => [...current, { id, message, status }]);
      timers.current.set(id, setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
        timers.current.delete(id);
      }, 6000));
    };

    window.addEventListener("api-error", handleApiError);
    return () => {
      window.removeEventListener("api-error", handleApiError);
      timers.current.forEach(clearTimeout);
      timers.current.clear();
    };
  }, []);

  const dismiss = (id: number) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  return (
    <div
      aria-label="Thông báo lỗi"
      aria-live="assertive"
      className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3"
    >
      {toasts.map(({ id, message, status }) => (
        <div
          key={id}
          className="pointer-events-auto flex items-start gap-3 rounded-lg border border-destructive/30 bg-background p-4 text-foreground shadow-lg"
          role="alert"
          data-slot="toast"
          data-variant="destructive"
        >
          <CircleX className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Thao tác chưa thành công</p>
            <p className="mt-1 break-words text-sm text-muted-foreground">{message}</p>
            <span className="sr-only">Mã lỗi: {status}</span>
          </div>
          <button
            type="button"
            className="-mr-1 -mt-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Đóng thông báo"
            onClick={() => dismiss(id)}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
