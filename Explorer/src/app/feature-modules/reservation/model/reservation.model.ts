import { CompanyEquipment } from '../../company/model/companyModel';

export interface Reservation {
  id?: number;
  dateTime: Date;
  duration: number;
  grade: number;
  status: ReservationStatus;
  customerId: number;
  companyAdminId: number;
  reservationOfEquipments?: ReservationEquipment[];
}


export interface ReservationEquipment {
  equipmentName: string;
  quantity: number;
}


export enum ReservationStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  PickedUp = 'PickedUp',
  Cancelled = 'Cancelled',
}

export interface CancelationModel {
  reservationId: number;
  updatedPoints: number;
}
