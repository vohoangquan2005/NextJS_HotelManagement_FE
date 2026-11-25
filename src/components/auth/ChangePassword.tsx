"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, LoaderCircle } from "lucide-react";
import { changePassword } from "@/app/api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const response = await changePassword({ currentPassword, newPassword, confirmNewPassword });
            // A few deployments return 204 after updating the password.
            // The password change still succeeded even without a JSON body.
            setSuccess(response?.message || "Đổi mật khẩu thành công!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Không thể đổi mật khẩu.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-muted/30 px-4 py-10">
            <section className="w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-xl">
                <div className="bg-primary px-6 py-8 text-primary-foreground sm:px-8">
                    <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-white/15">
                        <KeyRound className="size-7" />
                    </div>
                    <h1 className="text-2xl font-bold">Đổi mật khẩu</h1>
                    <p className="mt-2 text-sm text-primary-foreground/80">Nhập mật khẩu hiện tại và chọn mật khẩu mới.</p>
                </div>

                <form className="space-y-4 p-6 sm:p-8" onSubmit={submit}>
                    <label className="block space-y-2 text-sm font-medium">Mật khẩu hiện tại
                        <Input required type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} disabled={loading} />
                    </label>
                    <label className="block space-y-2 text-sm font-medium">Mật khẩu mới
                        <Input required type="password" minLength={6} maxLength={100} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} disabled={loading} />
                    </label>
                    <label className="block space-y-2 text-sm font-medium">Xác nhận mật khẩu mới
                        <Input required type="password" minLength={6} maxLength={100} autoComplete="new-password" value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} disabled={loading} />
                    </label>

                    {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
                    {success && <p role="status" className="rounded-lg border border-emerald-600/30 bg-emerald-600/5 p-3 text-sm text-emerald-700">{success}</p>}

                    <div className="flex flex-wrap justify-between gap-3 pt-2">
                        <Button type="button" variant="outline" nativeButton={false} render={<Link href="/profile" />}>
                            <ArrowLeft className="size-4" /> Quay lại hồ sơ
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <LoaderCircle className="size-4 animate-spin" />}
                            {loading ? "Đang đổi…" : "Đổi mật khẩu"}
                        </Button>
                    </div>
                </form>
            </section>
        </main>
    );
}
