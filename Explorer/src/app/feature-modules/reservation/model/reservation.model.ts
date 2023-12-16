export interface Reservation {
    id: number;
    dateTime: Date;
    duration: string; // Assuming Duration is represented as a string in your Java DTO
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

