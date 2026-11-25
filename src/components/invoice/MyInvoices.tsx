"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, LoaderCircle, RefreshCw } from "lucide-react";
import { getMyInvoices } from "@/app/api/invoice.api";
import { requestInvoiceBalancePayment } from "@/app/api/payment.api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { InvoiceResponseDto } from "@/types/invoice";

const money = (amount: number) => `${amount.toLocaleString("vi-VN")} VNĐ`;
const date = (value: string | null) => value ? new Date(value).toLocaleDateString("vi-VN") : "—";

export default function MyInvoices() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [activeId, setActiveId] = useState<number | null>(null);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setInvoices(await getMyInvoices()); }
    catch (e) { setError(e instanceof Error ? e.message : "Không thể tải hóa đơn."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { if (authLoading) return; if (!user) { router.replace("/login?redirect=%2Finvoices"); return; } if (user.roleName === "Customer") queueMicrotask(() => void load()); }, [authLoading, user, router, load]);
  if (authLoading || !user || loading) return <div className="flex min-h-72 items-center justify-center gap-2 text-muted-foreground"><LoaderCircle className="size-5 animate-spin"/>Đang tải hóa đơn…</div>;
  if (user.roleName !== "Customer") return <div className="p-12 text-center">Trang này dành cho khách hàng.</div>;

  async function requestPayment(invoiceId: number) {
    setActiveId(invoiceId); setError(""); setNotice("");
    try {
      await requestInvoiceBalancePayment(invoiceId);
      setNotice("Đã tạo khoản thanh toán. Bạn có thể gửi thông tin thanh toán ở trang Thanh toán của tôi.");
    } catch (e) { setError(e instanceof Error ? e.message : "Không thể tạo yêu cầu thanh toán."); }
    finally { setActiveId(null); }
  }

  return <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-widest text-primary">Tài khoản khách hàng</p><h1 className="mt-2 text-3xl font-bold">Hóa đơn của tôi</h1><p className="mt-2 text-sm text-muted-foreground">Hóa đơn được tạo sau khi thanh toán cuối được xác nhận.</p></div><Button variant="outline" onClick={() => void load()}><RefreshCw className="size-4"/>Làm mới</Button></div>
    {error && <p role="alert" className="rounded-lg border border-destructive/30 p-3 text-sm text-destructive">{error}</p>}
    {notice && <p role="status" className="rounded-lg border border-emerald-600/30 bg-emerald-600/5 p-3 text-sm text-emerald-700">{notice} <Link href="/payments" className="underline">Mở thanh toán</Link></p>}
    {invoices.length === 0 ? <Card><CardContent className="py-12 text-center text-muted-foreground"><FileText className="mx-auto size-8"/><p className="mt-3">Chưa có hóa đơn hoàn tất.</p></CardContent></Card> : <div className="space-y-4">{invoices.map(i => <Card key={i.invoiceId}><CardHeader className="flex-row flex-wrap justify-between gap-3"><div><CardTitle>Hóa đơn #{i.invoiceId} · Đặt phòng #{i.bookingId}</CardTitle><CardDescription className="mt-1">{i.customerName || "Khách hàng"} · CCCD {i.customerCCCD || "—"} · {i.customerNationality || "—"}</CardDescription></div><span className="rounded-full border bg-muted px-3 py-1 text-xs">{["Chưa thanh toán", "Thanh toán một phần", "Đã thanh toán"][Number(i.status)] ?? "Trạng thái"}</span></CardHeader><CardContent><div className="grid gap-2 text-sm sm:grid-cols-2"><p>Dự kiến: {date(i.expectedCheckIn)} – {date(i.expectedCheckOut)}</p><p>Thực tế: {date(i.actualCheckIn)} – {date(i.actualCheckOut)}</p></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[520px] text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="py-2">Khoản phí</th><th className="py-2">SL</th><th className="py-2 text-right">Đơn giá</th><th className="py-2 text-right">Thành tiền</th></tr></thead><tbody className="divide-y">{i.lineItems?.map((line, index) => <tr key={`${line.category}-${index}`}><td className="py-2">{line.description}</td><td className="py-2">{line.quantity}</td><td className="py-2 text-right">{money(line.unitPrice)}</td><td className="py-2 text-right">{money(line.amount)}</td></tr>)}</tbody></table></div><dl className="ml-auto mt-4 max-w-sm space-y-2 border-t pt-3 text-sm"><div className="flex justify-between"><dt>Tạm tính</dt><dd>{money(i.subTotal)}</dd></div><div className="flex justify-between"><dt>Giảm giá</dt><dd>−{money(i.discountAmount)}</dd></div><div className="flex justify-between"><dt>Thuế</dt><dd>{money(i.taxAmount)}</dd></div><div className="flex justify-between font-semibold"><dt>Tổng</dt><dd>{money(i.amountDue)}</dd></div><div className="flex justify-between"><dt>Đã thanh toán (sau hoàn)</dt><dd>{money(i.paidAmount)}</dd></div><div className="flex justify-between font-bold"><dt>Còn lại</dt><dd>{money(i.remainingAmount)}</dd></div></dl>{i.remainingAmount > 0 && <Button className="mt-4" disabled={activeId === i.invoiceId} onClick={() => void requestPayment(i.invoiceId)}>{activeId === i.invoiceId ? "Đang tạo…" : "Tạo khoản thanh toán còn lại"}</Button>}</CardContent></Card>)}</div>}
  </div>;
}
