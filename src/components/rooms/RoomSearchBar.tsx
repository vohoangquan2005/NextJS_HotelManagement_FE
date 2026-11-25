"use client";

import { useFormFields } from "@/hooks/useFormFields";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { filterRooms } from "@/app/api/room.api";
import type {
    RoomFilterDto,
    RoomResponseDto,
} from "@/types/room";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Search, RotateCcw } from "lucide-react";

interface RoomSearchBarProps {
    onResults: (rooms: RoomResponseDto[]) => void;
    rooms: RoomResponseDto[];
}

const initialValues: RoomFilterDto = {
    roomTypeId: null,
    minPrice: null,
    maxPrice: null,
    minCapacity: null,
    maxCapacity: null,
};

const MIN_PRICE = 100000;   // Giá tiền nhỏ nhất: 100.000 vnd
const MIN_MAX_PRICE = 1000000;  // Giá tiền cao nhất: 1 triệu
const PRICE_STEP = 100000;   // Giá trị mỗi lần tăng or giảm: 100.000 vnd

export default function RoomSearchBar({ onResults, rooms }: RoomSearchBarProps) {
    const { values, setValues } = useFormFields<RoomFilterDto>(initialValues);
    const { loading, error, setError, handleSubmit }
        = useFormSubmit<RoomFilterDto, RoomResponseDto[]>(
            filterRooms, {
            onSuccess: (rooms) => {
                onResults(rooms);
            },
        },
        );

    // Định dạng tiền Việt Nam: 100000 -> 100.000
    const formatCurrency = (value: number | null | undefined) => {
        if (value == null) return "";
        return new Intl.NumberFormat("vi-VN").format(value);
    };

    // Chuyển chuỗi hiển thị về số: "100.000" -> 100000
    const parseCurrency = (value: string) => {
        const digits = value.replace(/\D/g, "");
        return digits === "" ? null : Number(digits);
    };

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>,) => {
        event.preventDefault();
        if (values.minPrice != null
            && values.maxPrice != null
            && values.minPrice > values.maxPrice
        ) {
            setError("Giá thấp nhất không được lớn hơn giá cao nhất.");
            return;
        }
        await handleSubmit(values);
    };

    const handleReset = async () => {
        setValues(initialValues);
        setError("");
        await handleSubmit(initialValues);
    }
    return (
        <form
            onSubmit={handleSearch}
            className="rounded-xl border bg-background p-5 shadow-sm"
        >
            <div className="mb-5 flex items-center gap-2">
                <Search className="size-5 text-primary" />
                <h2 className="text-lg font-semibold">
                    Tìm kiếm và lọc phòng
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Loại phòng */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Mã loại phòng
                    </label>

                    <Select
                        value={
                            values.roomTypeId == null
                                ? "Tất cả"
                                : String(values.roomTypeId)
                        }
                        onValueChange={(value) => {
                            setValues((previous) => ({
                                ...previous,
                                roomTypeId:
                                    !value || value === "all"
                                        ? null
                                        : Number(value),
                            }));
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tất cả loại phòng" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">
                                Tất cả loại phòng
                            </SelectItem>
                            {[...new Map(rooms.map((room) => [room.roomTypeId, room.roomTypeName])).entries()].map(([id, name]) => (
                                <SelectItem key={id} value={String(id)}>{name || `Loại phòng ${id}`}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/*Giá thấp nhất*/}
                <div className="space-y-2">
                    <label htmlFor="minPrice" className="text-sm font-medium">
                        Giá thấp nhất (VNĐ/đêm)
                    </label>

                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Input
                                id="minPrice"
                                name="minPrice"
                                type="text"
                                inputMode="numeric"
                                placeholder="100.000"
                                value={formatCurrency(values.minPrice)}
                                onChange={(event) => {
                                    const price = parseCurrency(event.target.value);

                                    setValues((previous) => ({
                                        ...previous,
                                        minPrice:
                                            price === null
                                                ? null
                                                : Math.max(MIN_PRICE, price),
                                    }));
                                }}
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                VND
                            </span>
                        </div>

                        <div className="flex flex-row gap-1">
                            <button
                                type="button"
                                aria-label="Tăng giá thấp nhất"
                                className="rounded border px-3 py-1 text-sm hover:bg-accent"
                                onClick={() => {
                                    setValues((previous) => ({
                                        ...previous,
                                        minPrice:
                                            Math.max(
                                                MIN_PRICE,
                                                previous.minPrice ?? MIN_PRICE
                                            ) + PRICE_STEP,
                                    }));
                                }}
                            >
                                +
                            </button>

                            <button
                                type="button"
                                aria-label="Giảm giá thấp nhất"
                                disabled={
                                    values.minPrice == null ||
                                    values.minPrice <= MIN_PRICE
                                }
                                className="rounded border px-3 py-1 text-sm hover:bg-accent disabled:opacity-50"
                                onClick={() => {
                                    setValues((previous) => ({
                                        ...previous,
                                        minPrice: Math.max(
                                            MIN_PRICE,
                                            (previous.minPrice ?? MIN_PRICE) - PRICE_STEP
                                        ),
                                    }));
                                }}
                            >
                                −
                            </button>
                        </div>
                    </div>
                </div>

                {/* Giá cao nhất */}
                <div className="space-y-2">
                    <label htmlFor="maxPrice" className="text-sm font-medium">
                        Giá cao nhất (VNĐ/đêm)
                    </label>

                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Input
                                id="maxPrice"
                                name="maxPrice"
                                type="text"
                                inputMode="numeric"
                                placeholder="1.000.000"
                                value={formatCurrency(values.maxPrice)}
                                onChange={(event) => {
                                    const price = parseCurrency(event.target.value);

                                    setValues((previous) => ({
                                        ...previous,
                                        maxPrice:
                                            price === null
                                                ? null
                                                : Math.max(MIN_MAX_PRICE, price),
                                    }));
                                }}
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                VND
                            </span>
                        </div>

                        <div className="flex flex-row gap-1">
                            <button
                                type="button"
                                aria-label="Tăng giá cao nhất"
                                className="rounded border px-3 py-1 text-sm hover:bg-accent"
                                onClick={() => {
                                    setValues((previous) => ({
                                        ...previous,
                                        maxPrice:
                                            Math.max(
                                                MIN_MAX_PRICE,
                                                previous.maxPrice ?? MIN_MAX_PRICE
                                            ) + PRICE_STEP,
                                    }));
                                }}
                            >
                                +
                            </button>

                            <button
                                type="button"
                                aria-label="Giảm giá cao nhất"
                                disabled={
                                    values.maxPrice == null ||
                                    values.maxPrice <= MIN_PRICE
                                }
                                className="rounded border px-3 py-1 text-sm hover:bg-accent disabled:opacity-50"
                                onClick={() => {
                                    setValues((previous) => ({
                                        ...previous,
                                        maxPrice: Math.max(
                                            MIN_MAX_PRICE,
                                            (previous.maxPrice ?? MIN_MAX_PRICE) - PRICE_STEP
                                        ),
                                    }));
                                }}
                            >
                                −
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sức chứa tối thiểu */}
                <div className="space-y-2">
                    <label
                        htmlFor="minCapacity"
                        className="text-sm font-medium"
                    >
                        Sức chứa tối thiểu
                    </label>

                    <div className="flex items-center gap-2">
                        <Input
                            id="minCapacity"
                            name="minCapacity"
                            type="number"
                            min={1}
                            step={1}
                            placeholder="Số khách tối thiểu"
                            value={values.minCapacity ?? ""}
                            onChange={(event) => {
                                const value = event.target.value;

                                setValues((previous) => ({
                                    ...previous,
                                    minCapacity:
                                        value === ""
                                            ? null
                                            : Math.max(1, Math.floor(Number(value))),
                                }));
                            }}
                        />

                        <div className="flex flex-row gap-1">
                            <button
                                type="button"
                                aria-label="Tăng sức chứa tối thiểu"
                                className="rounded border px-3 py-1 text-sm hover:bg-accent"
                                onClick={() => {
                                    setValues((previous) => ({
                                        ...previous,
                                        minCapacity:
                                            (previous.minCapacity ?? 0) + 1,
                                    }));
                                }}
                            >
                                +
                            </button>

                            <button
                                type="button"
                                aria-label="Giảm sức chứa tối thiểu"
                                disabled={
                                    values.minCapacity == null ||
                                    values.minCapacity <= 1
                                }
                                className="rounded border px-3 py-1 text-sm hover:bg-accent disabled:opacity-50"
                                onClick={() => {
                                    setValues((previous) => ({
                                        ...previous,
                                        minCapacity: Math.max(
                                            1,
                                            (previous.minCapacity ?? 1) - 1
                                        ),
                                    }));
                                }}
                            >
                                −
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sức chứa tối đa */}
                <div className="space-y-2">
                    <label
                        htmlFor="maxCapacity"
                        className="text-sm font-medium"
                    >
                        Sức chứa tối đa
                    </label>

                    <div className="flex items-center gap-2">
                        <Input
                            id="maxCapacity"
                            name="maxCapacity"
                            type="number"
                            min={1}
                            step={1}
                            placeholder="Số khách tối đa"
                            value={values.maxCapacity ?? ""}
                            onChange={(event) => {
                                const value = event.target.value;

                                setValues((previous) => ({
                                    ...previous,
                                    maxCapacity:
                                        value === ""
                                            ? null
                                            : Math.max(1, Math.floor(Number(value))),
                                }));
                            }}
                        />

                        <div className="flex flex-row gap-1">
                            <button
                                type="button"
                                aria-label="Tăng sức chứa tối đa"
                                className="rounded border px-3 py-1 text-sm hover:bg-accent"
                                onClick={() => {
                                    setValues((previous) => ({
                                        ...previous,
                                        maxCapacity:
                                            (previous.maxCapacity ?? 0) + 1,
                                    }));
                                }}
                            >
                                +
                            </button>

                            <button
                                type="button"
                                aria-label="Giảm sức chứa tối đa"
                                disabled={
                                    values.maxCapacity == null ||
                                    values.maxCapacity <= 1
                                }
                                className="rounded border px-3 py-1 text-sm hover:bg-accent disabled:opacity-50"
                                onClick={() => {
                                    setValues((previous) => ({
                                        ...previous,
                                        maxCapacity: Math.max(
                                            1,
                                            (previous.maxCapacity ?? 1) - 1
                                        ),
                                    }));
                                }}
                            >
                                −
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <p role="alert" className="mt-4 text-sm text-destructive">
                    {error}
                </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
                <Button type="submit" disabled={loading}>
                    <Search className="mr-2 size-4" />
                    {loading ? "Đang tìm..." : "Tìm phòng"}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    onClick={handleReset}
                >
                    <RotateCcw className="mr-2 size-4" />
                    Xóa bộ lọc
                </Button>
            </div>
        </form>
    );
}
