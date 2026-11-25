"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { getRoomTypes, getRoomTypeById } from "@/app/api/room-type.api";
import { getAll, getRoomById } from "@/app/api/room.api";
import { getPromotions, getPromotionById, getApplyPromotions, getApplyPromotionById } from "@/app/api/promotion.api";
import { getServices, getServiceById } from "@/app/api/service.api";
import { getServicePackages, getServicePackageById } from "@/app/api/service-package.api";
import { getCancellationPolicies, getCancellationPolicyById } from "@/app/api/cancellation-policy.api";
import { ErrorAlertDialog } from "@/components/common/ErrorAlertDialog";

type RecordItem = Record<string, unknown>;
type SectionKey = "room-types" | "rooms" | "promotions" | "promotion-application" | "services" | "service-packages" | "cancellation-policies";
type SectionConfig = {
    title: string;
    description: string;
    load: () => Promise<unknown[]>;
    get: (id: number) => Promise<unknown>;
    id: (item: RecordItem) => number;
    label: (item: RecordItem) => string;
};

const idField = (item: RecordItem, key: string) => Number(item[key]);
const text = (value: unknown) => value == null || value === "" ? "—" : String(value);
const unwrap = <T,>(value: T[]) => value as unknown[];
const roomStatuses = ["Sẵn sàng", "Đang sử dụng", "Đang dọn dẹp", "Đang bảo trì"];
const cancellationUnits = ["Giờ", "Ngày", "Tuần", "Tháng"];
function displayValue(key: string, value: unknown) {
    if (key === "status" && typeof value === "number") return roomStatuses[value] ?? text(value);
    if (key === "cancellationTimeUnit" && typeof value === "number") return cancellationUnits[value] ?? text(value);
    if ((key === "startDate" || key === "endDate") && typeof value === "string") {
        return new Date(value).toLocaleDateString("vi-VN");
    }
    if (typeof value === "number" && ["unitPrice", "packagePrice", "pricePerNight", "minAmount", "maxDisCountAmount"].includes(key)) {
        return `${value.toLocaleString("vi-VN")} VNĐ`;
    }
    return text(value);
}

const sections: Record<SectionKey, SectionConfig> = {
    "room-types": {
        title: "Loại phòng",
        description: "Danh sách loại phòng đang hoạt động.",
        load: async () => unwrap(await getRoomTypes()),
        get: getRoomTypeById,
        id: (item) => idField(item, "roomTypeId"),
        label: (item) => text(item.roomTypeName),
    },
    rooms: {
        title: "Phòng",
        description: "Thông tin phòng và trạng thái phục vụ đặt phòng.",
        load: async () => unwrap(await getAll()),
        get: getRoomById,
        id: (item) => idField(item, "roomId"),
        label: (item) => `${text(item.roomName)} · ${text(item.roomTypeName)}`,
    },
    promotions: {
        title: "Khuyến mãi",
        description: "Các chương trình khuyến mãi đang hoạt động.",
        load: async () => unwrap(await getPromotions()),
        get: getPromotionById,
        id: (item) => idField(item, "promotionId"),
        label: (item) => `${text(item.promotionCode)} · ${text(item.promotionName)}`,
    },
    "promotion-application": {
        title: "Áp dụng khuyến mãi",
        description: "Các loại phòng được liên kết với chương trình khuyến mãi.",
        load: async () => unwrap(await getApplyPromotions()),
        get: getApplyPromotionById,
        id: (item) => idField(item, "applyPromotionId"),
        label: (item) => `${text(item.promotionName ?? item.promotionId)} · ${text(item.roomTypeName)}`,
    },
    services: {
        title: "Dịch vụ",
        description: "Danh sách dịch vụ đang hoạt động.",
        load: async () => unwrap(await getServices()),
        get: getServiceById,
        id: (item) => idField(item, "serviceId"),
        label: (item) => text(item.serviceName),
    },
    "service-packages": {
        title: "Gói dịch vụ",
        description: "Các gói dịch vụ hiện có.",
        load: async () => unwrap(await getServicePackages()),
        get: getServicePackageById,
        id: (item) => idField(item, "servicePackageId"),
        label: (item) => text(item.packageName),
    },
    "cancellation-policies": {
        title: "Chính sách hủy đặt phòng",
        description: "Các chính sách hủy đang có hiệu lực.",
        load: async () => unwrap(await getCancellationPolicies()),
        get: getCancellationPolicyById,
        id: (item) => idField(item, "cancellationPolicyId"),
        label: (item) => text(item.policyName),
    },
};

const labels: Record<string, string> = {
    roomTypeName: "Tên loại phòng", bedCount: "Số giường", bedType: "Loại giường", size: "Diện tích",
    description: "Mô tả", roomName: "Tên phòng", capacity: "Sức chứa",
    location: "Vị trí", pricePerNight: "Giá mỗi đêm", status: "Trạng thái", promotionCode: "Mã khuyến mãi",
    promotionName: "Tên khuyến mãi", discountValue: "Mức giảm", minAmount: "Giá trị tối thiểu",
    maxDisCountAmount: "Mức giảm tối đa", usageLimit: "Giới hạn sử dụng", usedCount: "Đã sử dụng",
    startDate: "Ngày bắt đầu", endDate: "Ngày kết thúc", promotionId: "Mã khuyến mãi", serviceName: "Tên dịch vụ",
    unitPrice: "Đơn giá", unit: "Đơn vị", packageName: "Tên gói", packagePrice: "Giá gói",
    policyName: "Tên chính sách", cancellationTime: "Thời hạn hủy", cancellationTimeUnit: "Đơn vị thời hạn",
    refundPercentage: "Tỷ lệ hoàn tiền", roomTypeId: "Mã loại phòng", applyPromotionId: "Mã áp dụng",
};

const ignored = new Set(["isDeleted", "roomImages", "createAt", "updateAt"]);

export default function StaffReferenceData({ section }: { section: SectionKey }) {
    const config = sections[section];
    const [items, setItems] = useState<RecordItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState<RecordItem | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const result = await config.load();
            setItems(Array.isArray(result) ? result as RecordItem[] : []);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Không thể tải dữ liệu.");
        } finally {
            setLoading(false);
        }
    }, [config]);

    useEffect(() => { queueMicrotask(() => void load()); }, [load]);

    async function openDetail(item: RecordItem) {
        setSelected(item);
        setDetailLoading(true);
        setError("");
        try {
            setSelected(await config.get(config.id(item)) as RecordItem);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Không thể tải chi tiết.");
        } finally {
            setDetailLoading(false);
        }
    }

    const detailRows = useMemo(() => selected
        ? Object.entries(selected).filter(([key]) => !ignored.has(key))
        : [], [selected]);

    return (
        <section className="mx-auto max-w-6xl space-y-5">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">{config.title}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
                </div>
                <Button variant="outline" onClick={() => void load()} disabled={loading}>Làm mới</Button>
            </header>
            {error && <p role="alert" className="rounded-lg border border-destructive/30 p-3 text-sm text-destructive">{error}</p>}
            {loading ? <p className="py-12 text-center text-sm text-muted-foreground">Đang tải dữ liệu…</p> : items.length === 0 ? (
                <p className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">Chưa có dữ liệu.</p>
            ) : (
                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full min-w-[560px] text-left text-sm">
                        <thead className="border-b bg-muted/50 text-muted-foreground"><tr><th className="p-3">Thông tin</th><th className="p-3">Mã</th><th className="p-3 text-right">Chi tiết</th></tr></thead>
                        <tbody className="divide-y">
                            {items.map((item) => {
                                const id = config.id(item);
                                return <tr key={id}>
                                    <td className="p-3 font-medium">{config.label(item)}</td>
                                    <td className="p-3 text-muted-foreground">#{id}</td>
                                    <td className="p-3 text-right"><Button size="sm" variant="outline" onClick={() => void openDetail(item)}>Xem chi tiết</Button></td>
                                </tr>;
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{config.title}: {selected ? config.label(selected) : ""}</DialogTitle>
                        <DialogDescription>Thông tin chi tiết chỉ đọc từ hệ thống.</DialogDescription>
                    </DialogHeader>
                    {detailLoading ? <p className="py-5 text-muted-foreground">Đang tải chi tiết…</p> : (
                        <dl className="grid gap-3 sm:grid-cols-2">
                            {detailRows.map(([key, value]) => <div key={key} className="rounded-lg bg-muted/40 p-3">
                                <dt className="text-xs text-muted-foreground">{labels[key] ?? key}</dt>
                                <dd className="mt-1 break-words text-sm font-medium">{displayValue(key, value)}</dd>
                            </div>)}
                        </dl>
                    )}
                </DialogContent>
            </Dialog>
            <ErrorAlertDialog message={error && selected ? error : ""} onClose={() => setError("")} />
        </section>
    );
}
