
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CircleAlert,
    ConciergeBell,
    LoaderCircle,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    createService,
    deleteService,
    getDeletedServices,
    getServices,
    restoreService,
    softDeleteService,
    updateService,
    type ServiceWriteDto,
} from "@/app/api/service.api";
import type { ServiceResponseDto } from "@/types/service";
import { ServiceEditor } from "@/components/service/ServiceForm";

export default function ServiceManagement() {
    const [services, setServices] = useState<ServiceResponseDto[]>([]);
    const [search, setSearch] = useState("");
    const [showDeleted, setShowDeleted] = useState(false);
    const [editing, setEditing] = useState<
        ServiceResponseDto | null | undefined
    >(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Tải danh sách dịch vụ
    const load = useCallback(async (deleted: boolean) => {
        setLoading(true);
        setError("");

        try {
            const data = deleted
                ? await getDeletedServices()
                : await getServices();

            setServices(Array.isArray(data) ? data : []);
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể tải dịch vụ."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // Tự động tải dữ liệu khi khởi tạo hoặc chuyển danh sách
    useEffect(() => {
        let active = true;

        async function fetchServices() {
            setLoading(true);
            setError("");

            try {
                const data = showDeleted
                    ? await getDeletedServices()
                    : await getServices();

                if (active) {
                    setServices(Array.isArray(data) ? data : []);
                }
            } catch (cause) {
                if (active) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : "Không thể tải dịch vụ."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        void fetchServices();

        return () => {
            active = false;
        };
    }, [showDeleted]);

    // Tìm kiếm dịch vụ
    const visible = useMemo(() => {
        if (!Array.isArray(services)) return [];

        const query = search.trim().toLocaleLowerCase("vi");

        return services.filter(
            (service) =>
                !query ||
                `${service.serviceName ?? ""} ${service.unit ?? ""}`
                    .toLocaleLowerCase("vi")
                    .includes(query)
        );
    }, [services, search]);

    // Thêm hoặc cập nhật dịch vụ
    async function save(data: ServiceWriteDto) {
        try {
            if (editing) {
                await updateService(editing.serviceId, data);
            } else {
                await createService(data);
            }

            setEditing(undefined);
            await load(false);
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Không thể lưu dịch vụ."
            );
        }
    }

    // Xử lý trạng thái dịch vụ
    async function updateState(
        service: ServiceResponseDto,
        action: "soft-delete" | "restore" | "delete"
    ) {
        const actionName =
            action === "restore"
                ? "khôi phục"
                : action === "delete"
                    ? "xóa vĩnh viễn"
                    : "xóa mềm";

        if (
            !window.confirm(
                `Xác nhận ${actionName} dịch vụ “${service.serviceName || service.serviceId
                }”?`
            )
        ) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            if (action === "restore") {
                await restoreService(service.serviceId);
            } else if (action === "delete") {
                await deleteService(service.serviceId);
            } else {
                await softDeleteService(service.serviceId);
            }

            await load(showDeleted);
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : `Không thể ${actionName} dịch vụ.`
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Tiêu đề và thao tác */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Danh mục dịch vụ
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">
                        {showDeleted
                            ? "Dịch vụ đã xóa mềm"
                            : "Dịch vụ"}
                    </h1>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        disabled={showDeleted}
                        onClick={() => setEditing(null)}
                    >
                        <Plus className="mr-2 size-4" />
                        Thêm dịch vụ
                    </Button>

                    <button
                        onClick={() => {
                            setShowDeleted((prev) => !prev);
                            setSearch("");
                        }}
                        className="h-10 rounded-md border px-4 text-sm"
                    >
                        {showDeleted
                            ? "Dịch vụ đang hoạt động"
                            : "Dịch vụ đã xóa"}
                    </button>
                </div>
            </div>

            {/* Tìm kiếm và làm mới */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative max-w-lg flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        className="pl-9"
                        placeholder="Tìm tên dịch vụ hoặc đơn vị tính"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />
                </div>

                <button
                    onClick={() => void load(showDeleted)}
                    disabled={loading}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm disabled:opacity-50"
                >
                    <RefreshCw
                        className={`size-4 ${loading ? "animate-spin" : ""
                            }`}
                    />
                    Làm mới
                </button>
            </div>

            {/* Thông báo lỗi */}
            {error && (
                <p
                    role="alert"
                    className="flex items-center gap-2 rounded-xl border border-destructive/30 p-4 text-sm text-destructive"
                >
                    <CircleAlert className="size-5" />
                    {error}
                </p>
            )}

            {/* Danh sách dịch vụ */}
            {loading ? (
                <div className="flex min-h-48 items-center justify-center gap-3 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải dịch vụ…
                </div>
            ) : visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-10 text-center">
                    <ConciergeBell className="mx-auto size-8 text-muted-foreground/60" />

                    <p className="mt-3 text-sm text-muted-foreground">
                        {services.length
                            ? "Không tìm thấy kết quả."
                            : "Chưa có dịch vụ."}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full min-w-[700px] text-left text-sm">
                        <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3">Dịch vụ</th>
                                <th className="px-4 py-3">Đơn giá</th>
                                <th className="px-4 py-3">Đơn vị</th>
                                <th className="px-4 py-3 text-right">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {visible.map((service) => (
                                <tr
                                    key={service.serviceId}
                                    className="hover:bg-muted/30"
                                >
                                    <td className="px-4 py-3">
                                        <p className="font-medium">
                                            {service.serviceName ||
                                                `Dịch vụ #${service.serviceId}`}
                                        </p>

                                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                            {service.description ||
                                                "Chưa có mô tả"}
                                        </p>
                                    </td>

                                    <td className="px-4 py-3 font-medium">
                                        {service.unitPrice.toLocaleString(
                                            "vi-VN"
                                        )}{" "}
                                        VNĐ
                                    </td>

                                    <td className="px-4 py-3">
                                        {service.unit || "—"}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        <div className="inline-flex flex-wrap justify-end gap-2">
                                            {showDeleted ? (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            void updateState(
                                                                service,
                                                                "restore"
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs"
                                                    >
                                                        <Undo2 className="size-3.5" />
                                                        Khôi phục
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            void updateState(
                                                                service,
                                                                "delete"
                                                            )
                                                        }
                                                        className="rounded-md border px-3 py-2 text-xs text-destructive"
                                                    >
                                                        Xóa vĩnh viễn
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            setEditing(service)
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                        Sửa
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            void updateState(
                                                                service,
                                                                "soft-delete"
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs text-destructive"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                        Xóa mềm
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Form thêm / sửa dịch vụ */}
            {editing !== undefined && (
                <ServiceEditor
                    service={editing}
                    onClose={() => setEditing(undefined)}
                    onSave={save}
                />
            )}
        </div>
    );
}
