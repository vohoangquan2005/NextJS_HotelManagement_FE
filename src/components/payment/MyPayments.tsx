"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleAlert, CreditCard, LoaderCircle, RefreshCw } from "lucide-react";
import { getMyPayments, submitPayment } from "@/app/api/payment.api";
import { useAuth } from "@/contexts/AuthContext";
import { useFormFields } from "@/hooks/useFormFields";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PaymentResponseDto } from "@/types/payment";

const typeLabels = ["Thanh toán", "Đặt cọc", "Hoàn tiền"];
const statusLabels = ["Chờ xác nhận", "Thành công", "Thất bại"];
const money = (amount: number) => `${amount.toLocaleString("vi-VN")} VNĐ`;

export default function MyPayments() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [payments, setPayments] = useState<PaymentResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [activeId, setActiveId] = useState<number | null>(null);
    const { values, handleChange, setValues } = useFormFields({ paymentMethod: "Chuyển khoản", transactionCode: "" });

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try { setPayments(await getMyPayments()); }
        catch (cause) { setError(cause instanceof Error ? cause.message : "Không thể tải thanh toán."); }
        finally { setLoading(false); }
    }, []);

    const { handleSubmit, loading: submitting, error: submitError } = useFormSubmit<
        { id: number; paymentMethod: string; transactionCode: string }, PaymentResponseDto
    >(({ id, ...data }) => submitPayment(id, data), {
        onSuccess: async () => {
            setNotice("Thông tin đã gửi. Giao dịch đang chờ nhân viên xác nhận.");
            setActiveId(null);
            await load();
        },
    });

    useEffect(() => {
        if (authLoading) return;
        if (!user) { router.replace("/login?redirect=%2Fpayments"); return; }
        if (user.roleName === "Customer") queueMicrotask(() => void load());
    }, [authLoading, user, router, load]);

    if (authLoading || !user || loading) return <div className="flex min-h-72 items-center justify-center gap-2 text-muted-foreground"><LoaderCircle className="size-5 animate-spin" />Đang tải thanh toán…</div>;
    if (user.roleName !== "Customer") return <div className="p-12 text-center">Trang này dành cho khách hàng.</div>;

    async function pay(payment: PaymentResponseDto) {
        setNotice("");
        const result = await handleSubmit({ id: payment.paymentId, ...values });
        if (result) setValues({ paymentMethod: "Chuyển khoản", transactionCode: "" });
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div><p className="text-sm font-semibold uppercase tracking-widest text-primary">Tài khoản khách hàng</p><h1 className="mt-2 text-3xl font-bold">Thanh toán của tôi</h1><p className="mt-2 text-sm text-muted-foreground">Giao dịch được lọc theo tài khoản hiện đăng nhập.</p></div>
                <Button variant="outline" onClick={() => void load()}><RefreshCw className="size-4" />Làm mới</Button>
            </div>
            {notice && <p role="status" className="rounded-lg border border-emerald-600/30 bg-emerald-600/5 p-3 text-sm text-emerald-700">{notice}</p>}
            {(error || submitError) && <p role="alert" className="flex gap-2 rounded-lg border border-destructive/30 p-3 text-sm text-destructive"><CircleAlert className="size-4" />{error || submitError}</p>}

            {payments.length === 0 ? (
                <Card><CardContent className="py-12 text-center text-muted-foreground"><CreditCard className="mx-auto size-8" /><p className="mt-3">Bạn chưa có giao dịch.</p><Link className="mt-3 inline-block text-primary underline" href="/bookings">Xem đặt phòng</Link></CardContent></Card>
            ) : (
                <div className="space-y-4">
                    {payments.map((payment) => {
                        const isDeposit = Number(payment.paymentType) === 1;
                        const canPay = Number(payment.status) !== 1 && Number(payment.paymentType) !== 2 && !(isDeposit && Number(payment.bookingStatus) >= 3);
                        return (
                            <Card key={payment.paymentId}>
                                <CardHeader className="flex-row flex-wrap items-start justify-between gap-3">
                                    <div><CardTitle>Giao dịch #{payment.paymentId} · {typeLabels[Number(payment.paymentType)] ?? "Thanh toán"}</CardTitle><CardDescription className="mt-1">{payment.bookingId ? <Link className="underline" href={`/bookings/${payment.bookingId}`}>Đặt phòng #{payment.bookingId}</Link> : `Hóa đơn #${payment.invoiceId ?? "—"}`} {payment.refundSource ? `· ${payment.refundSource}` : ""}</CardDescription></div>
                                    <span className="rounded-full border bg-muted px-3 py-1 text-xs font-medium">{statusLabels[Number(payment.status)] ?? "Không xác định"}</span>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2 text-sm sm:grid-cols-3"><p>Số tiền: <strong>{money(payment.amount)}</strong></p><p>Phương thức: {payment.paymentMethod || "Chưa chọn"}</p><p>Mã giao dịch: {payment.transactionCode || "Chưa ghi nhận"}</p></div>
                                    {canPay && <div className="rounded-xl border bg-muted/20 p-4">
                                        <p className="text-sm font-medium">Gửi thông tin thanh toán</p>
                                        <p className="mt-1 text-xs text-muted-foreground">Thanh toán được xác nhận sau khi nhân viên đối soát. Trang web không tự đánh dấu giao dịch thành công.</p>
                                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                            <div className="space-y-1"><Label htmlFor={`method-${payment.paymentId}`}>Phương thức</Label><Input id={`method-${payment.paymentId}`} name="paymentMethod" value={values.paymentMethod} onChange={handleChange} maxLength={30} /></div>
                                            <div className="space-y-1"><Label htmlFor={`code-${payment.paymentId}`}>Mã giao dịch / ghi chú chuyển khoản</Label><Input id={`code-${payment.paymentId}`} name="transactionCode" value={values.transactionCode} onChange={handleChange} maxLength={100} /></div>
                                        </div>
                                        <Button className="mt-3" disabled={submitting} onClick={() => { setActiveId(payment.paymentId); void pay(payment); }}>{submitting && activeId === payment.paymentId ? "Đang gửi…" : "Gửi thông tin thanh toán"}</Button>
                                    </div>}
                                    {isDeposit && Number(payment.bookingStatus) >= 3 && Number(payment.status) !== 1 && <p className="text-sm text-muted-foreground">Khoản cọc đã hết hiệu lực sau checkout; xem khoản thanh toán cuối trong danh sách.</p>}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
