
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    LoaderCircle,
    RefreshCw,
    Search,
    Pencil,
    Trash2,
    Undo2,
    Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PromotionForm } from "@/components/promotion/PromotionForm";

import { getRoomTypes } from "@/app/api/room-type.api";

import {
    createPromotion,
    deletePromotion,
    getApplyPromotions,
    getDeletedPromotions,
    getPromotions,
    restorePromotion,
    softDeletePromotion,
    updatePromotion,
} from "@/app/api/promotion.api";

import type { PromotionDto, PromotionWriteDto } from "@/types/promotion";
import type { RoomTypeDto } from "@/types/room-type";

const MIN_PRICE = 100000;

function toLocalDateTimeInput(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
        .toISOString()
        .slice(0, 16);
}

const fresh = (): PromotionWriteDto => ({
    promotionCode: "",
    promotionName: "",
    discountType: 0,
    discountValue: 0,
    minAmount: MIN_PRICE,
    maxDisCountAmount: null,
    usageLimit: null,
    startDate: "",
    endDate: "",
});

export default function PromotionManagement() {
    const [items, setItems] = useState<PromotionDto[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomTypeDto[]>([]);
    const [roomTypeIds, setRoomTypeIds] = useState<number[]>([]);

    const [deleted, setDeleted] = useState(false);
    const [query, setQuery] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [editing, setEditing] = useState<PromotionDto | null>(null);
    const [form, setForm] = useState<PromotionWriteDto>(fresh());
    const [showForm, setShowForm] = useState(false);

    const [saving, setSaving] = useState(false);

    const load = useCallback(
        async (includeDeleted = deleted) => {
            setLoading(true);
            setError("");

            try {
                const [rows, types, applies] = await Promise.all([
                    includeDeleted ? getDeletedPromotions() : getPromotions(),
                    getRoomTypes(),
                    getApplyPromotions(),
                ]);

                setItems(Array.isArray(rows) ? rows : []);
                setRoomTypes(Array.isArray(types) ? types : []);

                if (editing) {
                    setRoomTypeIds(
                        (Array.isArray(applies) ? applies : [])
                            .filter(
                                (a) => a.promotionId === editing.promotionId
                            )
                            .map((a) => a.roomTypeId)
                    );
                }
            } catch (e) {
                setError(
                    e instanceof Error
                        ? e.message
                        : "Không thể tải khuyến mãi."
                );
            } finally {
                setLoading(false);
            }
        },
        [deleted, editing]
    );

    useEffect(() => {
        let active = true;

        Promise.all([
            deleted ? getDeletedPromotions() : getPromotions(),
            getRoomTypes(),
            getApplyPromotions(),
        ])
            .then(([rows, types, applies]) => {
                if (active) {
                    setItems(Array.isArray(rows) ? rows : []);
                    setRoomTypes(Array.isArray(types) ? types : []);

                    if (editing) {
                        setRoomTypeIds(
                            (Array.isArray(applies) ? applies : [])
                                .filter(
                                    (a) => a.promotionId === editing.promotionId
                                )
                                .map((a) => a.roomTypeId)
                        );
                    }
                }
            })
            .catch((e) => {
                if (active) {
                    setError(
                        e instanceof Error
                            ? e.message
                            : "Không thể tải khuyến mãi."
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [deleted, editing]);

    const rows = useMemo(() => {
        if (!Array.isArray(items)) return [];

        const q = query.trim().toLocaleLowerCase("vi");

        return items.filter((x) =>
            `${x.promotionCode ?? ""} ${x.promotionName ?? ""}`
                .toLocaleLowerCase("vi")
                .includes(q)
        );
    }, [items, query]);

    function open(item?: PromotionDto) {
        setEditing(item ?? null);

        setForm(
            item
                ? {
                    promotionCode: item.promotionCode ?? "",
                    promotionName: item.promotionName ?? "",
                    discountType: item.discountType ?? 0,
                    discountValue: item.discountValue ?? 0,
                    minAmount: Math.max(
                        MIN_PRICE,
                        item.minAmount ?? MIN_PRICE
                    ),
                    maxDisCountAmount: item.maxDisCountAmount,
                    usageLimit: item.usageLimit,
                    startDate: toLocalDateTimeInput(item.startDate),
                    endDate: toLocalDateTimeInput(item.endDate),
                }
                : fresh()
        );

        setRoomTypeIds([]);
        setShowForm(true);
        setError("");
        setNotice("");
    }

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setSaving(true);
        setError("");
        setNotice("");

        try {
            const payload = {
                ...form,
                startDate: new Date(form.startDate).toISOString(),
                endDate: new Date(form.endDate).toISOString(),
            };

            if (editing) {
                await updatePromotion(
                    editing.promotionId,
                    payload,
                    roomTypeIds
                );
            } else {
                await createPromotion(payload, roomTypeIds);
            }

            setNotice(
                editing
                    ? "Đã cập nhật khuyến mãi và loại phòng áp dụng."
                    : "Đã tạo khuyến mãi và loại phòng áp dụng."
            );

            setShowForm(false);
            setEditing(null);

            await load();
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Không thể lưu khuyến mãi."
            );
        } finally {
            setSaving(false);
        }
    }

    async function act(
        item: PromotionDto,
        action: "soft" | "restore" | "delete"
    ) {
        const label =
            action === "soft"
                ? "xóa mềm"
                : action === "restore"
                    ? "khôi phục"
                    : "xóa vĩnh viễn";

        if (
            !window.confirm(
                `Xác nhận ${label} khuyến mãi ${item.promotionCode}?`
            )
        ) {
            return;
        }

        try {
            if (action === "soft") {
                await softDeletePromotion(item.promotionId);
            } else if (action === "restore") {
                await restorePromotion(item.promotionId);
            } else {
                await deletePromotion(item.promotionId);
            }

            setNotice(`Đã ${label} khuyến mãi.`);

            await load();
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : `Không thể ${label} khuyến mãi.`
            );
        }
    }

    return (
        <section className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Quản lý ưu đãi
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        {deleted ? "Khuyến mãi đã xóa" : "Khuyến mãi"}
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
                            Thêm khuyến mãi
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
                    placeholder="Tìm mã hoặc tên khuyến mãi"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {showForm && (
                <PromotionForm
                    editing={editing}
                    form={form}
                    setForm={setForm}
                    roomTypes={roomTypes}
                    roomTypeIds={roomTypeIds}
                    setRoomTypeIds={setRoomTypeIds}
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
                    Không có khuyến mãi phù hợp.
                </div>
            ) : (
                <div className="grid gap-3">
                    {rows.map((item) => (
                        <article
                            key={item.promotionId}
                            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4"
                        >
                            <div>
                                <h2 className="font-semibold">
                                    {item.promotionName}{" "}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        ({item.promotionCode})
                                    </span>
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {item.discountType === 1
                                        ? `Giảm ${(item.discountValue ?? 0).toLocaleString("vi-VN")} VNĐ`
                                        : `Giảm ${item.discountValue ?? 0}%`} · đã dùng{" "}
                                    {item.usedCount ?? 0}
                                    {item.usageLimit != null
                                        ? `/${item.usageLimit}`
                                        : ""}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    {new Date(
                                        item.startDate
                                    ).toLocaleDateString("vi-VN")}{" "}
                                    –{" "}
                                    {new Date(
                                        item.endDate
                                    ).toLocaleDateString("vi-VN")}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {deleted ? (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                void act(item, "restore")
                                            }
                                        >
                                            <Undo2 className="mr-1 size-3" />
                                            Khôi phục
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                void act(item, "delete")
                                            }
                                        >
                                            <Trash2 className="mr-1 size-3" />
                                            Xóa hẳn
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => open(item)}
                                        >
                                            <Pencil className="mr-1 size-3" />
                                            Sửa
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-destructive"
                                            onClick={() =>
                                                void act(item, "soft")
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
