export interface ServicePackageDto { servicePackageId: number; packageName: string | null; packagePrice: number; description: string | null; isDeleted: number; }
export interface ServicePackageWriteDto { packageName: string; packagePrice: number; description: string | null; }
