import { fetchApi } from "./client";
import type { AuditLogDto } from "@/types/audit-log";
export const getAuditLogs = () => fetchApi<AuditLogDto[]>("/AuditLog");
