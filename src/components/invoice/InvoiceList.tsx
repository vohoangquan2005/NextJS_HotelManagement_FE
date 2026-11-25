"use client";

import { Trash2 } from "lucide-react";

import type { InvoiceResponseDto } from "@/types/invoice";

const invoiceStatuses = ["Chưa thanh toán", "Thanh toán một phần", "Đã thanh toán"];
const money = (amount: number) => amount.toLocaleString("vi-VN") + " VNĐ";

export function InvoiceList({
    invoices,
    activeId,
    isAdmin,
    onDelete,
}: {
    invoices: InvoiceResponseDto[];
    activeId: number | null;
    isAdmin: boolean;
    onDelete: (invoice: InvoiceResponseDto) => void;
}) {
    return (
        <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full min-w-[930px] text-left text-sm">
                <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                    <tr>
                        <th className="px-4 py-3">Hóa đơn</th>
                        <th className="px-4 py-3">Khách hàng</th>
                        <th className="px-4 py-3">Tạm tính</th>
                        <th className="px-4 py-3">Thuế</th>
                        <th className="px-4 py-3">Giảm giá</th>
                        <th className="px-4 py-3">Còn phải trả</th>
                        <th className="px-4 py-3">Trạng thái</th>
                        <th className="px-4 py-3 text-right">Thao tác</th>
                    </tr>
                </thead>

                <tbody className="divide-y">
                    {invoices.map((invoice) => (
                        <tr key={invoice.invoiceId} className="hover:bg-muted/30">
                            <td className="px-4 py-3">
                                <p className="font-medium">#{invoice.invoiceId}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Đặt phòng #{invoice.bookingId}
                                </p>
                            </td>

                            <td className="px-4 py-3">{invoice.customerName || "—"}</td>

                            <td className="px-4 py-3">{money(invoice.subTotal)}</td>

                            <td className="px-4 py-3">{money(invoice.taxAmount)}</td>

                            <td className="px-4 py-3">{money(invoice.discountAmount)}</td>

                            <td className="px-4 py-3 font-semibold">
                                {money(invoice.remainingAmount)}
                            </td>

                            <td className="px-4 py-3">
                                <span className="rounded-full border bg-muted px-2.5 py-1 text-xs">
                                    {invoiceStatuses[Number(invoice.status)] ??
                                        String(invoice.status)}
                                </span>

                                <details className="mt-2">
                                    <summary className="cursor-pointer text-xs text-primary">
                                        Chi tiết
                                    </summary>

                                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                                        <p>Tổng phải trả: {money(invoice.amountDue)}</p>
                                        <p>Đã thanh toán: {money(invoice.paidAmount)}</p>
                                    </div>
                                </details>
                            </td>

                            <td className="px-4 py-3 text-right">
                                {isAdmin && (
                                    <button
                                        disabled={activeId === invoice.invoiceId}
                                        onClick={() => onDelete(invoice)}
                                        aria-label="Xóa hóa đơn"
                                        className="rounded-md border p-2 text-destructive disabled:opacity-50"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
