import { TypeOfEquipment } from "../../company/model/companyModel";

export interface Equipment {
    id: number,
    name: string;
    description: string;
    typeOfEquipment: TypeOfEquipment;
    grade: string;
    price: number;
    companySet: EquipmentCompany[];
  }

  export interface EquipmentCompany {
    name: string;
    adress: string;
    description: string;
    grade: string;
  }