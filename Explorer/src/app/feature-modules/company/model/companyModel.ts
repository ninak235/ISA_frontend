import { Equipment } from "../../equipment/model/equipmentModel";

export interface Company {
  id?: number;
  name: string;
  locationDto: LocationDto; // Include the location property
  description: string;
  grade: string;
  equipmentSet: CompanyEquipment[];
  adminsSet: CompanyAdmin[];
}

export interface LocationDto {
  id?: number;
  address: string;
  city: string;
  country: string;
  longitude: number;
  latitude: number;
}

// ... rest of the code remains unchanged


export interface CompanyAdmin {
  firstName: string;
  lastName: string;
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