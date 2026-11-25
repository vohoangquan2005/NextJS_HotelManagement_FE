
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    LoaderCircle,
    Plus,
    RefreshCw,
    Search,
    Pencil,
    Trash2,
    Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    createCancellationPolicy,
    deleteCancellationPolicy,
    getCancellationPolicies,
    getDeletedCancellationPolicies,
    restoreCancellationPolicy,
    softDeleteCancellationPolicy,
    updateCancellationPolicy,
} from "@/app/api/cancellation-policy.api";

import type {
    CancellationPolicyDto,
    CancellationPolicyWriteDto,
} from "@/types/cancellation-policy";

import { CancellationPolicyForm } from "@/components/cancellation-policy/CancellationPolicyForm";

const units = ["Giờ", "Ngày", "Tuần", "Tháng"];

const blank = (): CancellationPolicyWriteDto => ({
    policyName: "",
    cancellationTime: 24,
    cancellationTimeUnit: 0,
    refundPercentage: 100,
    description: "",
});

export default function CancellationPolicyManagement() {
    const [items, setItems] = useState<CancellationPolicyDto[]>([]);
    const [deleted, setDeleted] = useState(false);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [editing, setEditing] = useState<CancellationPolicyDto | null>(null);
    const [form, setForm] = useState<CancellationPolicyWriteDto>(blank());
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const load = useCallback(
        async (inactive = deleted) => {
            setLoading(true);
            setError("");

            try {
                const data = inactive
                    ? await getDeletedCancellationPolicies()
                    : await getCancellationPolicies();

                setItems(Array.isArray(data) ? data : []);
            } catch (e) {
                setError(
                    e instanceof Error
                        ? e.message
                        : "Không thể tải chính sách hủy.",
                );
            } finally {
                setLoading(false);
            }
        },
        [deleted],
    );

    useEffect(() => {
        let active = true;

        const fetcher = deleted
            ? getDeletedCancellationPolicies
            : getCancellationPolicies;

        fetcher()
            .then((data) => {
                if (active) {
                    setItems(Array.isArray(data) ? data : []);
                }
            })
            .catch((e) => {
                if (active) {
                    setError(
                        e instanceof Error
                            ? e.message
                            : "Không thể tải chính sách hủy.",
                    );
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [deleted]);

    const rows = useMemo(() => {
        if (!Array.isArray(items)) return [];

        const q = query.trim().toLocaleLowerCase("vi");

        return items.filter((x) =>
            `${x.policyName ?? ""} ${x.description ?? ""}`
                .toLocaleLowerCase("vi")
                .includes(q),
        );
    }, [items, query]);

    function open(x?: CancellationPolicyDto) {
        setEditing(x ?? null);

        setForm(
            x
                ? {
                    policyName: x.policyName ?? "",
                    cancellationTime: x.cancellationTime,
                    cancellationTimeUnit: x.cancellationTimeUnit,
                    refundPercentage: x.refundPercentage,
                    description: x.description,
                }
                : blank(),
        );

        setShowForm(true);
        setError("");
    }

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            if (editing) {
                await updateCancellationPolicy(
                    editing.cancellationPolicyId,
                    form,
                );
            } else {
                await createCancellationPolicy(form);
            }

            setNotice(
                editing
                    ? "Đã cập nhật chính sách."
                    : "Đã tạo chính sách.",
            );

            setShowForm(false);
            await load();
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Không thể lưu chính sách.",
            );
        } finally {
            setSaving(false);
        }
    }

    async function act(
        x: CancellationPolicyDto,
        action: "soft" | "restore" | "delete",
    ) {
        const label =
            action === "soft"
                ? "xóa mềm"
                : action === "restore"
                    ? "khôi phục"
                    : "xóa vĩnh viễn";

        if (
            !window.confirm(
                `Xác nhận ${label} chính sách ${x.policyName}?`,
            )
        ) {
            return;
        }

        try {
            if (action === "soft") {
                await softDeleteCancellationPolicy(
                    x.cancellationPolicyId,
                );
            } else if (action === "restore") {
                await restoreCancellationPolicy(
                    x.cancellationPolicyId,
                );
            } else {
                await deleteCancellationPolicy(
                    x.cancellationPolicyId,
                );
            }

            setNotice(`Đã ${label} chính sách.`);
            await load();
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : `Không thể ${label} chính sách.`,
            );
        }
    }

    return (
        <section className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="mt-2 text-3xl font-bold">
                        {deleted
                            ? "Chính sách hủy đã xóa"
                            : "Chính sách hủy"}
                    </h1>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setDeleted(!deleted);
                            setQuery("");
                        }}
                        disabled={loading}
                    >
                        {deleted ? "Đang hoạt động" : "Đã xóa mềm"}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => void load()}
                        disabled={loading}
                    >
                        <RefreshCw className="mr-2 size-4" />
                        Làm mới
                    </Button>

                    {!deleted && (
                        <Button onClick={() => open()}>
                            <Plus className="mr-2 size-4" />
                            Thêm chính sách
                        </Button>
                    )}
                </div>
            </header>

            {notice && (
                <p
                    role="status"
                    className="rounded-lg border border-emerald-600/30 p-3 text-sm text-emerald-700"
                >
                    {notice}
                </p>
            )}

            {error && (
                <p
                    role="alert"
                    className="rounded-lg border border-destructive/30 p-3 text-sm text-destructive"
                >
                    {error}
                </p>
            )}

            <div className="relative max-w-lg">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    className="pl-9"
                    placeholder="Tìm tên hoặc mô tả chính sách"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* Modal thêm / sửa chính sách */}
            {showForm && (
                <CancellationPolicyForm
                    editing={editing}
                    form={form}
                    setForm={setForm}
                    saving={saving}
                    onSubmit={submit}
                    onClose={() => setShowForm(false)}
                />
            )}

            {loading ? (
                <div className="flex min-h-40 items-center justify-center gap-2 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải…
                </div>
            ) : rows.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                    Không có chính sách phù hợp.
                </div>
            ) : (
                <div className="space-y-3">
                    {rows.map((x) => (
                        <article
                            key={x.cancellationPolicyId}
                            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4"
                        >
                            <div>
                                <h2 className="font-semibold">
                                    {x.policyName}
                                </h2>

                                <p className="mt-1 text-sm">
                                    Hủy trong {x.cancellationTime}{" "}
                                    {units[x.cancellationTimeUnit] ??
                                        "đơn vị không xác định"}{" "}
                                    · hoàn {x.refundPercentage}%
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {x.description || "Chưa có mô tả"}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {deleted ? (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                void act(x, "restore")
                                            }
                                        >
                                            <Undo2 className="mr-1 size-3" />
                                            Khôi phục
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                void act(x, "delete")
                                            }
                                        >
                                            <Trash2 className="size-3" />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => open(x)}
                                        >
                                            <Pencil className="mr-1 size-3" />
                                            Sửa
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-destructive"
                                            onClick={() =>
                                                void act(x, "soft")
                                            }
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
