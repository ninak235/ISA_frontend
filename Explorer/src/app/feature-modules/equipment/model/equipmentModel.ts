import { TypeOfEquipment } from "../../company/model/companyModel";

export interface Equipment {
    name: string;
    description: string;
    typeOfEquipment: TypeOfEquipment;
    grade: string;
    price: number;
  }