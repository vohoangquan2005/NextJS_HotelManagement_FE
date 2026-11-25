export interface DashboardResponseDto {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  pendingBookings: number;
  confirmedBookings: number;
  checkedInBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalCustomers: number;
  newCustomersThisMonth: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  totalServices: number;
  activeServices: number;
  serviceUsagesThisMonth: number;
  activePromotions: number;
  expiringPromotions: number;
  expiredPromotions: number;
}
