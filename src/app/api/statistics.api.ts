import { fetchApi } from "./client";
import type { OccupancyDailyStatisticsDto, RevenueDailyStatisticsDto } from "@/types/statistics";

function rangeQuery(startDate: string, endDate: string) {
  const query = new URLSearchParams({ startDate, endDate });
  return query.toString();
}

export function getRevenueByDateRange(startDate: string, endDate: string): Promise<RevenueDailyStatisticsDto[]> {
  return fetchApi<RevenueDailyStatisticsDto[]>(`/Statistics/revenue/date-range?${rangeQuery(startDate, endDate)}`);
}

export function getOccupancyByDateRange(startDate: string, endDate: string): Promise<OccupancyDailyStatisticsDto[]> {
  return fetchApi<OccupancyDailyStatisticsDto[]>(`/Statistics/occupancy/date-range?${rangeQuery(startDate, endDate)}`);
}
