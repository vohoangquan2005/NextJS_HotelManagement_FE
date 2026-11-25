export interface ServiceResponseDto {
  serviceId: number;
  serviceName: string | null;
  unitPrice: number;
  unit: string | null;
  description: string | null;
  isDeleted: number;
}
