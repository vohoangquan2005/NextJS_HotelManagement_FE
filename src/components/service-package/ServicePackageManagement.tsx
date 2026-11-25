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
    createServicePackage,
    deleteServicePackage,
    getDeletedServicePackages,
    getServicePackages,
    restoreServicePackage,
    softDeleteServicePackage,
    updateServicePackage,
} from "@/app/api/service-package.api";

import type {
    ServicePackageDto,
    ServicePackageWriteDto,
} from "@/types/service-package";

import { ServicePackageForm } from "@/components/service-package/ServicePackageForm";

const MIN_PRICE = 10000;

const blank = (): ServicePackageWriteDto => ({
    packageName: "",
    packagePrice: MIN_PRICE,
    description: "",
});

export default function ServicePackageManagement() {
    const [items, setItems] = useState<ServicePackageDto[]>([]);
    const [deleted, setDeleted] = useState(false);
    const [query, setQuery] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [editing, setEditing] = useState<ServicePackageDto | null>(null);
    const [form, setForm] = useState<ServicePackageWriteDto>(blank());

    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    // Tải danh sách gói dịch vụ
    const load = useCallback(
        async (inactive = deleted) => {
            setLoading(true);
            setError("");

            try {
                const data = inactive
                    ? await getDeletedServicePackages()
                    : await getServicePackages();

                setItems(Array.isArray(data) ? data : []);
            } catch (e) {
                setError(
                    e instanceof Error
                        ? e.message
                        : "Không thể tải gói dịch vụ."
                );
            } finally {
                setLoading(false);
            }
        },
        [deleted],
    );

    // Tự động tải danh sách khi thay đổi trạng thái
    useEffect(() => {
        let active = true;

        const fetcher = deleted
            ? getDeletedServicePackages
            : getServicePackages;

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
                            : "Không thể tải gói dịch vụ."
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

    // Tìm kiếm và lọc gói dịch vụ
    const rows = useMemo(() => {
        if (!Array.isArray(items)) return [];

        const q = query.trim().toLocaleLowerCase("vi");

        return items.filter((x) =>
            `${x.packageName ?? ""} ${x.description ?? ""}`
                .toLocaleLowerCase("vi")
                .includes(q),
        );
    }, [items, query]);

    // Mở form thêm mới hoặc chỉnh sửa
    function open(item?: ServicePackageDto) {
        setEditing(item ?? null);

        setForm(
            item
                ? {
                    packageName: item.packageName ?? "",
                    packagePrice: item.packagePrice,
                    description: item.description,
                }
                : blank(),
        );

        setShowForm(true);
        setError("");
        setNotice("");
    }

    // Thêm hoặc cập nhật gói dịch vụ
    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setSaving(true);
        setError("");
        setNotice("");

        try {
            if (editing) {
                await updateServicePackage(
                    editing.servicePackageId,
                    form
                );
            } else {
                await createServicePackage(form);
            }

            setNotice(
                editing
                    ? "Đã cập nhật gói dịch vụ."
                    : "Đã thêm gói dịch vụ."
            );

            setShowForm(false);
            await load();
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Không thể lưu gói dịch vụ."
            );
        } finally {
            setSaving(false);
        }
    }

    // Xóa mềm, khôi phục hoặc xóa vĩnh viễn
    async function act(
        item: ServicePackageDto,
        action: "soft" | "restore" | "delete"
    ) {
        if (
            !window.confirm(
                `Xác nhận ${action === "soft"
                    ? "xóa mềm"
                    : action === "restore"
                        ? "khôi phục"
                        : "xóa vĩnh viễn"
                } gói ${item.packageName}?`
            )
        ) {
            return;
        }

        setError("");
        setNotice("");

        try {
            if (action === "soft") {
                await softDeleteServicePackage(item.servicePackageId);
            } else if (action === "restore") {
                await restoreServicePackage(item.servicePackageId);
            } else {
                await deleteServicePackage(item.servicePackageId);
            }

            setNotice("Đã cập nhật trạng thái gói dịch vụ.");

            await load();
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Không thể cập nhật gói dịch vụ."
            );
        }
    }

    return (
        <section className="space-y-6">
            {/* Tiêu đề và nút chức năng */}
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Danh mục dịch vụ
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        {deleted
                            ? "Gói dịch vụ đã xóa"
                            : "Gói dịch vụ"}
                    </h1>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setDeleted(!deleted);
                            setQuery("");
                            setNotice("");
                            setError("");
                        }}
                        disabled={loading}
                    >
                        {deleted ? "Đang hoạt động" : "Đã xóa mềm"}
                    </Button>

                    {!deleted && (
                        <Button onClick={() => open()}>
                            <Plus className="mr-2 size-4" />
                            Thêm gói
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        onClick={() => void load()}
                        disabled={loading}
                    >
                        <RefreshCw className="mr-2 size-4" />
                        Làm mới
                    </Button>
                </div>
            </header>

            {/* Thông báo */}
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

            {/* Tìm kiếm */}
            <div className="relative max-w-lg">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    className="pl-9"
                    placeholder="Tìm tên hoặc mô tả gói"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* Form thêm và chỉnh sửa */}
            {showForm && (
                <ServicePackageForm
                    editing={editing}
                    form={form}
                    setForm={setForm}
                    saving={saving}
                    onSubmit={submit}
                    onClose={() => setShowForm(false)}
                />
            )}

            {/* Danh sách gói dịch vụ */}
            {loading ? (
                <div className="flex min-h-40 items-center justify-center gap-2 text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin" />
                    Đang tải…
                </div>
            ) : rows.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                    Không có gói dịch vụ phù hợp.
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {rows.map((x) => (
                        <article
                            key={x.servicePackageId}
                            className="rounded-xl border bg-card p-4"
                        >
                            <div className="flex justify-between gap-3">
                                <div>
                                    <h2 className="font-semibold">
                                        {x.packageName}
                                    </h2>

                                    <p className="mt-1 font-medium text-primary">
                                        {x.packagePrice.toLocaleString("vi-VN")} VNĐ
                                    </p>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {x.description || "Chưa có mô tả"}
                                    </p>
                                </div>

                                <span className="text-xs text-muted-foreground">
                                    #{x.servicePackageId}
                                </span>
                            </div>

                            {/* Nút thao tác */}
                            <div className="mt-4 flex justify-end gap-2">
                                {deleted ? (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => void act(x, "restore")}
                                        >
                                            <Undo2 className="mr-1 size-3" />
                                            Khôi phục
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => void act(x, "delete")}
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
                                            onClick={() => void act(x, "soft")}
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
