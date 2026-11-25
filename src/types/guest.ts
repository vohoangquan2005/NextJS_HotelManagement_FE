export interface GuestDto {
  guestId: number; 
  bookingDetailId: number; 
  fullName: string | null; 
  dateOfBirth: string | null;
  gender: string | null; 
  nationality: string | null; 
  phoneNumber: string | null; 
  email: string | null;
  note: string | null; 
  createAt?: string | null; 
  updateAt?: string | null;
}
export type GuestWriteDto = Omit<GuestDto, "guestId" | "createAt" | "updateAt">;
