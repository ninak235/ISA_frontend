import { Equipment } from '../../administration/model/equipment.model';

export interface Company {
  name: string;
  adress: string;
  description: string;
  grade: string;
  equipmentSet: CompanyEquipment[];
}

export interface CompanyEquipment {
  name: string;
  description: string;
  status: EquipmentStatus;
}
export enum EquipmentStatus {
  Status1 = 'Available',
  Status2 = 'Unavailable',
}
