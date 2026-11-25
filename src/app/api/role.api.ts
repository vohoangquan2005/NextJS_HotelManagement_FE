import { fetchApi } from "./client";

export interface RoleDto { roleId: number; roleName: string | null; description: string | null; isDeleted: number; }
export interface RoleWriteDto { roleName: string; description: string | null; }
export const getRoles = () => fetchApi<RoleDto[]>("/Role");
export const getDeletedRoles = () => fetchApi<RoleDto[]>("/Role/deleted");
export const createRole = (body: RoleWriteDto) => fetchApi<RoleDto>("/Role", { method: "POST", body: JSON.stringify(body) });
export const updateRole = (id: number, body: RoleWriteDto) => fetchApi<void>(`/Role/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const softDeleteRole = (id: number) => fetchApi<void>(`/Role/${id}/soft-delete`, { method: "PATCH" });
export const restoreRole = (id: number) => fetchApi<void>(`/Role/${id}/restore`, { method: "PATCH" });
export const deleteRole = (id: number) => fetchApi<void>(`/Role/${id}`, { method: "DELETE" });
