export interface RevenueDailyStatisticsDto {
  date: string;
  revenue: number;
  paymentCount: number;
}

export interface OccupancyDailyStatisticsDto {
  date: string;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
}
