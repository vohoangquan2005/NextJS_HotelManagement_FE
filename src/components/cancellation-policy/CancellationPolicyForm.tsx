
"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
    CancellationPolicyDto,
    CancellationPolicyWriteDto,
} from "@/types/cancellation-policy";

const units = ["Giờ", "Ngày", "Tuần", "Tháng"];

export function CancellationPolicyForm({
    editing,
    form,
    setForm,
    saving,
    onSubmit,
    onClose,
}: {
    editing: CancellationPolicyDto | null;
    form: CancellationPolicyWriteDto;
    setForm: (value: CancellationPolicyWriteDto) => void;
    saving: boolean;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !saving) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="cancellation-policy-form-title"
                className="w-full max-w-2xl"
            >
                <form
                    onSubmit={onSubmit}
                    className="grid max-h-[90vh] gap-3 overflow-y-auto rounded-t-2xl border bg-card p-5 shadow-xl sm:grid-cols-2 sm:rounded-2xl sm:p-6"
                >
                    <h2
                        id="cancellation-policy-form-title"
                        className="font-semibold sm:col-span-2"
                    >
                        {editing ? "Sửa chính sách" : "Thêm chính sách"}
                    </h2>

                    <label className="space-y-1 text-sm">
                        Tên chính sách
                        <Input
                            required
                            maxLength={100}
                            value={form.policyName}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    policyName: e.target.value,
                                })
                            }
                        />
                    </label>

                    <label className="space-y-1 text-sm">
                        Thời gian áp dụng
                        <Input
                            required
                            type="number"
                            min={0}
                            max={100}
                            value={form.cancellationTime}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    cancellationTime: Number(e.target.value),
                                })
                            }
                        />
                    </label>

                    <label className="space-y-1 text-sm">
                        Đơn vị
                        <select
                            className="h-10 w-full rounded-md border bg-background px-3"
                            value={form.cancellationTimeUnit}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    cancellationTimeUnit: Number(e.target.value),
                                })
                            }
                        >
                            {units.map((x, i) => (
                                <option key={x} value={i}>
                                    {x}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="space-y-1 text-sm">
                        Hoàn trả (%)
                        <Input
                            required
                            type="number"
                            min={0}
                            max={100}
                            step="1"
                            value={form.refundPercentage}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    refundPercentage: Number(e.target.value),
                                })
                            }
                        />
                    </label>

                    <label className="space-y-1 text-sm sm:col-span-2">
                        Mô tả
                        <textarea
                            maxLength={500}
                            className="min-h-20 w-full rounded-md border bg-background px-3 py-2"
                            value={form.description ?? ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value || null,
                                })
                            }
                        />
                    </label>

                    <div className="flex justify-end gap-2 sm:col-span-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Đóng
                        </Button>

                        <Button 
                            type="submit"
                            disabled={saving}>
                            {saving ? "Đang lưu…" : "Lưu"}
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}
