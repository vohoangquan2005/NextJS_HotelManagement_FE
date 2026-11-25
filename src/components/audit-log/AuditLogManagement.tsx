"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LoaderCircle, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuditLogs } from "@/app/api/audit-log.api";
import type { AuditLogDto } from "@/types/audit-log";

const actions = [
    "Đăng nhập",
    "Đăng xuất",
    "Tạo",
    "Cập nhật",
    "Xác nhận",
    "Hủy",
    "Check-in",
    "Check-out",
    "Xóa mềm",
    "Khôi phục",
];

export default function AuditLogManagement() {
    const [items, setItems] = useState<AuditLogDto[]>([]);
    const [query, setQuery] = useState("");
    const [day, setDay] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getAuditLogs();
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(
                e instanceof Error ? e.message : "Không thể tải nhật ký."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        getAuditLogs()
            .then((data) => {
                if (active) setItems(Array.isArray(data) ? data : []);
            })
            .catch((e) => {
                if (active) {
                    setError(e instanceof Error ? e.message : "Không thể tải nhật ký.");
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const rows = useMemo(() => {
        if (!Array.isArray(items)) return [];
        const q = query.trim().toLocaleLowerCase("vi");

        return items.filter(
            (x) =>
                (!day || x.createAt?.slice(0, 10) === day) &&
                `${x.userName ?? ""} ${x.tableName ?? ""} ${x.recordId} ${
                    actions[x.action] ?? x.action
                }`
                    .toLocaleLowerCase("vi")
                    .includes(q)
        );
    }, [items, query, day]);

    return (
        <section className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Kiểm soát hệ thống
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">
                        Nhật ký thao tác
                    </h1>
                </div>

                <Button
                    variant="outline"
                    onClick={() => void load()}
                    disabled={loading}
                >
                    <RefreshCw className="mr-2 size-4" />
                    Làm mới
                </Button>
            </header>

            {error && (
                <p
                    role="alert"
                    className="rounded-lg border border-destructive/30 p-3 text-sm text-destructive"
                >
                    {error}
                </p>
            )}

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        placeholder="Tìm người dùng, bảng, thao tác hoặc mã bản ghi"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <Input
                    type="date"
                    aria-label="Lọc theo ngày"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex min-h-40 items-center justify-center gap-2 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải…
                </div>
            ) : rows.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                    Không có nhật ký phù hợp.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full min-w-[1000px] text-left text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                {[
                                    "Thời gian",
                                    "Người dùng",
                                    "Thao tác",
                                    "Bảng / Bản ghi",
                                    "Giá trị cũ",
                                    "Giá trị mới",
                                ].map((x) => (
                                    <th key={x} className="px-4 py-3">
                                        {x}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {rows.map((x) => (
                                <tr key={x.auditLogId}>
                                    <td className="px-4 py-3">
                                        {x.createAt
                                            ? new Date(
                                                  x.createAt
                                              ).toLocaleString("vi-VN")
                                            : "—"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {x.userName ||
                                            (x.userId
                                                ? `#${x.userId}`
                                                : "Hệ thống")}
                                    </td>

                                    <td className="px-4 py-3">
                                        {actions[x.action] ?? String(x.action)}
                                    </td>

                                    <td className="px-4 py-3">
                                        {x.tableName || "—"} · #{x.recordId}
                                    </td>

                                    <td
                                        className="max-w-xs truncate px-4 py-3"
                                        title={x.oldValue || ""}
                                    >
                                        {x.oldValue || "—"}
                                    </td>

                                    <td
                                        className="max-w-xs truncate px-4 py-3"
                                        title={x.newValue || ""}
                                    >
                                        {x.newValue || "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}