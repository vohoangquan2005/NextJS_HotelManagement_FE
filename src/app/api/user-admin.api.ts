import { fetchApi } from "./client";
import type { AdminUserDto } from "@/types/user-admin";

export const getAdminUsers = () => fetchApi<AdminUserDto[]>("/User");

export const getDeletedAdminUsers = () => fetchApi<AdminUserDto[]>("/User/deleted");

export const getAdminUserById = (id: number) => fetchApi<AdminUserDto>(`/User/${id}`);

export const createAdminUser = (data: FormData) =>
    fetchApi<AdminUserDto>("/User", {
        method: "POST",
        body: data,
    });

export const updateAdminUser = (id: number, data: FormData) =>
    fetchApi<void>(`/User/${id}`, {
        method: "PUT",
        body: data,
    });

export const deleteAdminUser = (id: number) => fetchApi<void>(`/User/${id}`, { method: "DELETE" });

export const softDeleteAdminUser = (id: number) =>
    fetchApi<void>(`/User/${id}/soft-delete`, { method: "PATCH" });

export const restoreAdminUser = (id: number) =>
    fetchApi<void>(`/User/${id}/restore`, { method: "PATCH" });
