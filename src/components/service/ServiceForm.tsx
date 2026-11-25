"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ServiceResponseDto } from "@/types/service";
import type { ServiceWriteDto } from "@/app/api/service.api";

const MIN_PRICE = 10000;
const PRICE_STEP = 10000;

export function ServiceEditor({
    service,
    onClose,
    onSave,
}: {
    service: ServiceResponseDto | null;
    onClose: () => void;
    onSave: (data: ServiceWriteDto) => Promise<void>;
}) {
    const [values, setValues] = useState<ServiceWriteDto>({
        serviceName: service?.serviceName ?? "",
        unitPrice: service?.unitPrice ?? 0,
        unit: service?.unit ?? "",
        description: service?.description ?? null,
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            await onSave({
                ...values,
                serviceName: values.serviceName.trim(),
                unit: values.unit.trim(),
                description: values.description?.trim() || null,
            });
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Không thể lưu dịch vụ.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="service-editor-title"
                className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border bg-background p-5 shadow-xl sm:rounded-2xl sm:p-7"
            >
                <div className="flex justify-between">
                    <div>
                        <h2 id="service-editor-title" className="text-xl font-bold">
                            {service ? "Sửa dịch vụ" : "Thêm dịch vụ"}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Đóng"
                        className="rounded-md p-2 hover:bg-muted"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <label className="block space-y-1.5 text-sm font-medium">
                        Tên dịch vụ
                        <Input
                            required
                            maxLength={100}
                            value={values.serviceName}
                            onChange={(event) =>
                                setValues({
                                    ...values,
                                    serviceName: event.target.value,
                                })
                            }
                        />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-1.5 text-sm font-medium">
                            Đơn giá (VNĐ)

                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        type="number"
                                        required
                                        min={MIN_PRICE}
                                        step={PRICE_STEP}
                                        className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        value={values.unitPrice}
                                        onChange={(event) =>
                                            setValues({
                                                ...values,
                                                unitPrice:
                                                    event.target.value === ""
                                                        ? 0
                                                        : Math.max(MIN_PRICE, Number(event.target.value)),
                                            })
                                        }
                                    />

                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        VNĐ
                                    </span>
                                </div>

                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        aria-label="Tăng đơn giá"
                                        className="rounded border px-3 py-1 text-sm hover:bg-accent"
                                        onClick={() =>
                                            setValues({
                                                ...values,
                                                unitPrice: Math.max(MIN_PRICE, values.unitPrice) + PRICE_STEP,
                                            })
                                        }
                                    >
                                        +
                                    </button>

                                    <button
                                        type="button"
                                        aria-label="Giảm đơn giá"
                                        className="rounded border px-3 py-1 text-sm hover:bg-accent disabled:opacity-50"
                                        disabled={values.unitPrice <= MIN_PRICE}
                                        onClick={() =>
                                            setValues({
                                                ...values,
                                                unitPrice: Math.max(
                                                    MIN_PRICE,
                                                    values.unitPrice - PRICE_STEP
                                                ),
                                            })
                                        }
                                    >
                                        −
                                    </button>
                                </div>
                            </div>
                        </label>

                        <label className="space-y-1.5 text-sm font-medium">
                            Đơn vị tính
                            <Input
                                required
                                value={values.unit}
                                onChange={(event) =>
                                    setValues({
                                        ...values,
                                        unit: event.target.value,
                                    })
                                }
                                placeholder="Ví dụ: lần, giờ, ngày"
                            />
                        </label>
                    </div>

                    <label className="block space-y-1.5 text-sm font-medium">
                        Mô tả
                        <textarea
                            maxLength={500}
                            value={values.description ?? ""}
                            onChange={(event) =>
                                setValues({
                                    ...values,
                                    description: event.target.value,
                                })
                            }
                            className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />
                    </label>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-md border border-destructive/30 p-3 text-sm text-destructive"
                        >
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" disabled={saving} onClick={onClose}>
                            Hủy
                        </Button>

                        <Button type="submit" disabled={saving}>
                            {saving ? "Đang lưu…" : "Lưu dịch vụ"}
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}
