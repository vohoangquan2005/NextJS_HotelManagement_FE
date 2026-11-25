import { fetchApi } from "./client";
import type { DashboardResponseDto } from "@/types/dashboard";

export function getDashboardOverview(): Promise<DashboardResponseDto> {
  return fetchApi<DashboardResponseDto>("/Dashboard");
}
