"use client";

import { Check, Trash2, X } from "lucide-react";

import type { PaymentResponseDto } from "@/types/payment";

const statuses = ["Đang chờ xử lý", "Thành công", "Thất bại"];
const types = ["Thanh toán", "Đặt cọc", "Hoàn tiền"];

const asDate = (value: string | null) =>
    value
        ? new Date(value).toLocaleString("vi-VN", {
              dateStyle: "medium",
              timeStyle: "short",
          })
        : "Chưa ghi nhận";

export function PaymentList({
    payments,
    activeId,
    isAdmin,
    onAction,
}: {
    payments: PaymentResponseDto[];
    activeId: number | null;
    isAdmin: boolean;
    onAction: (payment: PaymentResponseDto, action: "confirm" | "reject" | "delete") => void;
}) {
    return (
        <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                    <tr>
                        <th className="px-4 py-3">Giao dịch</th>
                        <th className="px-4 py-3">Hóa đơn</th>
                        <th className="px-4 py-3">Loại</th>
                        <th className="px-4 py-3">Phương thức</th>
                        <th className="px-4 py-3">Thời gian</th>
                        <th className="px-4 py-3 text-right">Số tiền</th>
                        <th className="px-4 py-3">Trạng thái</th>
                        <th className="px-4 py-3 text-right">Thao tác</th>
                    </tr>
                </thead>

                <tbody className="divide-y">
                    {payments.map((payment) => (
                        <tr key={payment.paymentId} className="hover:bg-muted/30">
                            <td className="px-4 py-3">
                                <p className="font-medium">#{payment.paymentId}</p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {payment.transactionCode || "Không có mã giao dịch"}
                                </p>
                            </td>

                            <td className="px-4 py-3">{payment.invoiceId ? `#${payment.invoiceId}` : payment.bookingId ? `Booking #${payment.bookingId}` : "—"}</td>

                            <td className="px-4 py-3">
                                {types[Number(payment.paymentType)] ?? String(payment.paymentType)}
                            </td>

                            <td className="px-4 py-3">{payment.paymentMethod || "—"}</td>

                            <td className="px-4 py-3">{asDate(payment.paymentDate)}</td>

                            <td className="px-4 py-3 text-right font-medium">
                                {payment.amount.toLocaleString("vi-VN")} VNĐ
                            </td>

                            <td className="px-4 py-3">
                                <span className="rounded-full border bg-muted px-2.5 py-1 text-xs">
                                    {statuses[Number(payment.status)] ?? String(payment.status)}
                                </span>
                            </td>

                            <td className="px-4 py-3 text-right">
                                <div className="inline-flex gap-2">
                                    {Number(payment.status) === 0 && (
                                        <>
                                            <button
                                                disabled={activeId === payment.paymentId}
                                                onClick={() => onAction(payment, "confirm")}
                                                className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-2 text-xs text-primary-foreground disabled:opacity-50"
                                            >
                                                <Check className="size-3.5" />
                                                Xác nhận
                                            </button>

                                            <button
                                                disabled={activeId === payment.paymentId}
                                                onClick={() => onAction(payment, "reject")}
                                                className="inline-flex items-center gap-1 rounded-md border px-2.5 py-2 text-xs text-destructive disabled:opacity-50"
                                            >
                                                <X className="size-3.5" />
                                                Từ chối
                                            </button>
                                        </>
                                    )}

                                    {isAdmin && Number(payment.status) !== 1 && (
                                        <button
                                            disabled={activeId === payment.paymentId}
                                            onClick={() => onAction(payment, "delete")}
                                            aria-label="Xóa giao dịch"
                                            className="rounded-md border p-2 text-destructive disabled:opacity-50"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
