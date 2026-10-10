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
}

const initialValues: RoomFilterDto = {
    roomTypeId: null,
    minPrice: null,
    maxPrice: null,
    minCapacity: null,
    maxCapacity: null,
};

export default function RoomSearchBar({ onResults, }: RoomSearchBarProps) {
    const { values, setValues, handleChange } = useFormFields<RoomFilterDto>(initialValues);
    const { loading, error, setError, handleSubmit }
        = useFormSubmit<RoomFilterDto, RoomResponseDto[]>(
            filterRooms, {
            onSuccess: (rooms) => {
                onResults(rooms);
            },
        },
        );

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
                                ? "all"
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
                            {/* Bổ sung các loại phòng từ API loại phòng */}
                            <SelectItem value="1">Loại phòng 1</SelectItem>
                            <SelectItem value="2">Loại phòng 2</SelectItem>
                            <SelectItem value="3">Loại phòng 3</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Giá thấp nhất */}
                <div className="space-y-2">
                    <label
                        htmlFor="minPrice"
                        className="text-sm font-medium"
                    >
                        Giá thấp nhất (VNĐ/đêm)
                    </label>

                    <Input
                        id="minPrice"
                        name="minPrice"
                        type="number"
                        min={0}
                        placeholder="Ví dụ: 300000"
                        value={values.minPrice ?? ""}
                        onChange={(event) => {
                            const value = event.target.value;

                            setValues((previous) => ({
                                ...previous,
                                minPrice: value === "" ? null : Number(value),
                            }));
                        }}
                    />
                </div>

                {/* Giá cao nhất */}
                <div className="space-y-2">
                    <label
                        htmlFor="maxPrice"
                        className="text-sm font-medium"
                    >
                        Giá cao nhất (VNĐ/đêm)
                    </label>

                    <Input
                        id="maxPrice"
                        name="maxPrice"
                        type="number"
                        min={0}
                        placeholder="Ví dụ: 1500000"
                        value={values.maxPrice ?? ""}
                        onChange={(event) => {
                            const value = event.target.value;

                            setValues((previous) => ({
                                ...previous,
                                maxPrice: value === "" ? null : Number(value),
                            }));
                        }}
                    />
                </div>

                {/* Sức chứa tối thiểu */}
                <div className="space-y-2">
                    <label
                        htmlFor="minCapacity"
                        className="text-sm font-medium"
                    >
                        Sức chứa tối thiểu
                    </label>

                    <Input
                        id="minCapacity"
                        name="minCapacity"
                        type="number"
                        min={1}
                        placeholder="Số khách tối thiểu"
                        value={values.minCapacity ?? ""}
                        onChange={(event) => {
                            const value = event.target.value;

                            setValues((previous) => ({
                                ...previous,
                                minCapacity:
                                    value === "" ? null : Number(value),
                            }));
                        }}
                    />
                </div>

                {/* Sức chứa tối đa */}
                <div className="space-y-2">
                    <label
                        htmlFor="maxCapacity"
                        className="text-sm font-medium"
                    >
                        Sức chứa tối đa
                    </label>

                    <Input
                        id="maxCapacity"
                        name="maxCapacity"
                        type="number"
                        min={1}
                        placeholder="Số khách tối đa"
                        value={values.maxCapacity ?? ""}
                        onChange={(event) => {
                            const value = event.target.value;

                            setValues((previous) => ({
                                ...previous,
                                maxCapacity:
                                    value === "" ? null : Number(value),
                            }));
                        }}
                    />
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