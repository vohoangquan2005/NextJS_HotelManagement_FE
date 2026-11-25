
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
    ServicePackageDto,
    ServicePackageWriteDto,
} from "@/types/service-package";

const MIN_PRICE = 10000;
const PRICE_STEP = 10000;

export function ServicePackageForm({
    editing,
    form,
    setForm,
    saving,
    onSubmit,
    onClose,
}: {
    editing: ServicePackageDto | null;
    form: ServicePackageWriteDto;
    setForm: (value: ServicePackageWriteDto) => void;
    saving: boolean;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
            role="presentation"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !saving
                ) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="service-package-form-title"
                className="w-full max-w-xl"
            >
                <form
                    onSubmit={onSubmit}
                    className="grid max-h-[90vh] gap-4 overflow-y-auto rounded-t-2xl border bg-card p-5 shadow-xl sm:grid-cols-2 sm:rounded-2xl sm:p-6"
                >
                    <h2
                        id="service-package-form-title"
                        className="font-semibold sm:col-span-2"
                    >
                        {editing
                            ? "Sửa gói dịch vụ"
                            : "Thêm gói dịch vụ"}
                    </h2>

                    {/* Tên gói */}
                    <label className="space-y-1 text-sm">
                        Tên gói
                        <Input
                            required
                            maxLength={100}
                            value={form.packageName}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    packageName: e.target.value,
                                })
                            }
                        />
                    </label>

                    {/* Giá gói */}
                    <label className="space-y-1 text-sm">
                        Giá gói (VNĐ)

                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Input
                                    required
                                    type="number"
                                    min={MIN_PRICE}
                                    step={PRICE_STEP}
                                    className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    value={form.packagePrice}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            packagePrice:
                                                e.target.value === ""
                                                    ? 0
                                                    : Math.max(
                                                        MIN_PRICE,
                                                        Number(e.target.value)
                                                    ),
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
                                    aria-label="Tăng giá gói"
                                    className="rounded border px-3 py-1 text-sm hover:bg-accent"
                                    onClick={() =>
                                        setForm({
                                            ...form,
                                            packagePrice:
                                                Math.max(
                                                    MIN_PRICE,
                                                    form.packagePrice
                                                ) + PRICE_STEP,
                                        })
                                    }
                                >
                                    +
                                </button>

                                <button
                                    type="button"
                                    aria-label="Giảm giá gói"
                                    disabled={form.packagePrice <= MIN_PRICE}
                                    className="rounded border px-3 py-1 text-sm hover:bg-accent disabled:opacity-50"
                                    onClick={() =>
                                        setForm({
                                            ...form,
                                            packagePrice: Math.max(
                                                MIN_PRICE,
                                                form.packagePrice - PRICE_STEP
                                            ),
                                        })
                                    }
                                >
                                    −
                                </button>
                            </div>
                        </div>
                    </label>

                    {/* Mô tả */}
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

                    {/* Nút thao tác */}
                    <div className="flex justify-end gap-2 sm:col-span-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Hủy
                        </Button>

                        <Button type="submit" disabled={saving}>
                            {saving ? "Đang lưu…" : "Lưu"}
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}
