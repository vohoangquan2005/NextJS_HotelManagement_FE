
"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PromotionDto, PromotionWriteDto } from "@/types/promotion";
import type { RoomTypeDto } from "@/types/room-type";

const PRICE_STEP = 100000;
const MIN_PRICE = 100000;

export function PromotionForm({
    editing,
    form,
    setForm,
    roomTypes,
    roomTypeIds,
    setRoomTypeIds,
    saving,
    onSubmit,
    onClose,
}: {
    editing: PromotionDto | null;
    form: PromotionWriteDto;
    setForm: (value: PromotionWriteDto) => void;
    roomTypes: RoomTypeDto[];
    roomTypeIds: number[];
    setRoomTypeIds: (value: number[] | ((current: number[]) => number[])) => void;
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
                aria-labelledby="promotion-form-title"
                className="w-full max-w-2xl"
            >
                <form
                    onSubmit={onSubmit}
                    className="grid max-h-[90vh] gap-3 overflow-y-auto rounded-t-2xl border bg-card p-5 shadow-xl sm:grid-cols-2 sm:rounded-2xl sm:p-6"
                >
                    <h2
                        id="promotion-form-title"
                        className="font-semibold sm:col-span-2"
                    >
                        {editing
                            ? `Sửa khuyến mãi #${editing.promotionId}`
                            : "Thông tin khuyến mãi"}
                    </h2>

                    {/* Mã khuyến mãi */}
                    <label className="space-y-1 text-sm">
                        Mã
                        <Input
                            required
                            maxLength={50}
                            value={form.promotionCode}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    promotionCode: e.target.value,
                                })
                            }
                        />
                    </label>

                    {/* Tên khuyến mãi */}
                    <label className="space-y-1 text-sm">
                        Tên
                        <Input
                            required
                            maxLength={100}
                            value={form.promotionName}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    promotionName: e.target.value,
                                })
                            }
                        />
                    </label>

                    <label className="space-y-1 text-sm">
                        Hình thức giảm
                        <select
                            value={form.discountType}
                            onChange={(event) =>
                                setForm({ ...form, discountType: Number(event.target.value) as 0 | 1 })
                            }
                            className="h-10 w-full rounded-md border bg-background px-3"
                        >
                            <option value={0}>Theo phần trăm</option>
                            <option value={1}>Số tiền cố định</option>
                        </select>
                    </label>

                    {/* Giá trị giảm */}
                    <label className="space-y-1 text-sm">
                        {form.discountType === 0 ? "Giảm (%)" : "Giảm (VNĐ)"}
                        <Input
                            type="number"
                            required
                            min={0}
                            max={form.discountType === 0 ? 100 : undefined}
                            step={form.discountType === 0 ? "1" : "1000"}
                            value={form.discountValue}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    discountValue: Number(e.target.value),
                                })
                            }
                        />
                    </label>

                    {/* Đơn tối thiểu */}
                    <label className="space-y-1 text-sm">
                        Đơn tối thiểu

                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Input
                                    type="number"
                                    min={MIN_PRICE}
                                    step={PRICE_STEP}
                                    value={form.minAmount}
                                    className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            minAmount:
                                                e.target.value === ""
                                                    ? MIN_PRICE
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
                                    aria-label="Tăng đơn tối thiểu"
                                    className="rounded border px-3 py-1 text-sm hover:bg-accent"
                                    onClick={() =>
                                        setForm({
                                            ...form,
                                            minAmount:
                                                Math.max(
                                                    MIN_PRICE,
                                                    form.minAmount
                                                ) + PRICE_STEP,
                                        })
                                    }
                                >
                                    +
                                </button>

                                <button
                                    type="button"
                                    aria-label="Giảm đơn tối thiểu"
                                    disabled={form.minAmount <= MIN_PRICE}
                                    className="rounded border px-3 py-1 text-sm hover:bg-accent disabled:opacity-50"
                                    onClick={() =>
                                        setForm({
                                            ...form,
                                            minAmount: Math.max(
                                                MIN_PRICE,
                                                form.minAmount - PRICE_STEP
                                            ),
                                        })
                                    }
                                >
                                    −
                                </button>
                            </div>
                        </div>
                    </label>

                    {/* Giảm tối đa */}
                    <label className="space-y-1 text-sm">
                        Giảm tối đa

                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Input
                                    type="number"
                                    min={MIN_PRICE}
                                    step={PRICE_STEP}
                                    value={form.maxDisCountAmount ?? ""}
                                    className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            maxDisCountAmount:
                                                e.target.value === ""
                                                    ? null
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
                                    aria-label="Tăng giảm tối đa"
                                    className="rounded border px-3 py-1 text-sm hover:bg-accent"
                                    onClick={() =>
                                        setForm({
                                            ...form,
                                            maxDisCountAmount:
                                                Math.max(
                                                    MIN_PRICE,
                                                    form.maxDisCountAmount ?? MIN_PRICE
                                                ) + PRICE_STEP,
                                        })
                                    }
                                >
                                    +
                                </button>

                                <button
                                    type="button"
                                    aria-label="Giảm giảm tối đa"
                                    disabled={
                                        form.maxDisCountAmount == null ||
                                        form.maxDisCountAmount <= MIN_PRICE
                                    }
                                    className="rounded border px-3 py-1 text-sm hover:bg-accent disabled:opacity-50"
                                    onClick={() =>
                                        setForm({
                                            ...form,
                                            maxDisCountAmount: Math.max(
                                                MIN_PRICE,
                                                (form.maxDisCountAmount ?? MIN_PRICE) - PRICE_STEP
                                            ),
                                        })
                                    }
                                >
                                    −
                                </button>
                            </div>
                        </div>
                    </label>

                    {/* Giới hạn lượt dùng */}
                    <label className="space-y-1 text-sm">
                        Giới hạn lượt dùng
                        <Input
                            type="number"
                            min={0}
                            value={form.usageLimit ?? ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    usageLimit: e.target.value
                                        ? Number(e.target.value)
                                        : null,
                                })
                            }
                        />
                    </label>

                    {/* Ngày bắt đầu */}
                    <label className="space-y-1 text-sm">
                        Bắt đầu
                        <Input
                            type="datetime-local"
                            required
                            value={form.startDate}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    startDate: e.target.value,
                                })
                            }
                        />
                    </label>

                    {/* Ngày kết thúc */}
                    <label className="space-y-1 text-sm">
                        Kết thúc
                        <Input
                            type="datetime-local"
                            required
                            min={form.startDate}
                            value={form.endDate}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    endDate: e.target.value,
                                })
                            }
                        />
                    </label>

                    {/* Loại phòng áp dụng */}
                    <fieldset className="space-y-2 sm:col-span-2">
                        <legend className="text-sm font-medium">
                            Loại phòng được áp dụng
                        </legend>

                        <div className="grid gap-2 sm:grid-cols-2">
                            {roomTypes.map((rt) => (
                                <label
                                    key={rt.roomTypeId}
                                    className="flex items-center gap-2 rounded-md border p-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={roomTypeIds.includes(rt.roomTypeId)}
                                        onChange={(e) =>
                                            setRoomTypeIds((current) =>
                                                e.target.checked
                                                    ? [...current, rt.roomTypeId]
                                                    : current.filter(
                                                        (id) => id !== rt.roomTypeId
                                                    )
                                            )
                                        }
                                    />
                                    {rt.roomTypeName}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    {/* Nút thao tác */}
                    <div className="flex justify-end gap-2 sm:col-span-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Đóng
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
