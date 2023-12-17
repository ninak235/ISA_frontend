import { Equipment } from "../../equipment/model/equipmentModel";

export interface Company {
  id?:number;
  name: string;
  adress: string;
  description: string;
  grade: string;
  equipmentSet: CompanyEquipment[];
}

export interface CompanyEquipment {
  id?:number;
  name: string;
  description: string;
  typeOfEquipment: TypeOfEquipment;
  grade: string;
  price: number;
}

export enum TypeOfEquipment {
  Type1 = 'Therapeutic',
  Type2 = 'Surgical',
  Type3 = 'Dental',
  Type4 = 'Rehabilitation',
}

export interface ComEq { 
   id?:number;
   equipmentId: number;
   companyId: number;
   quantity: number;
}