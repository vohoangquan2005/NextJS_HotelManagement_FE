export type PromotionDiscountType = 0 | 1;
export interface PromotionDto { promotionId: number; promotionCode: string | null; promotionName: string | null; discountType: PromotionDiscountType; discountValue: number | null; minAmount: number | null; maxDisCountAmount: number | null; usageLimit: number | null; usedCount: number | null; startDate: string; endDate: string; isDeleted: number; }
export interface PromotionWriteDto { promotionCode: string; promotionName: string; discountType: PromotionDiscountType; discountValue: number; minAmount: number; maxDisCountAmount: number | null; usageLimit: number | null; startDate: string; endDate: string; }
export interface ApplyPromotionDto { applyPromotionId: number; promotionId: number; roomTypeId: number; roomTypeName: string | null; }
