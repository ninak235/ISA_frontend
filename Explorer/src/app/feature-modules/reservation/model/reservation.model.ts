export interface Reservation {
    id?: number;
    dateTime: Date;
    duration: number; 
    grade: number;
    status: ReservationStatus;
    customerId: number;
    companyAdminId: number;
}

export enum ReservationStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Cancelled = 'Cancelled',
  }

