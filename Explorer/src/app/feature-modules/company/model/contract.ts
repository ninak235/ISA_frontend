export interface ContractEquipment {
    equipmentName: string;
    quantity: number;
  }
  
  export interface Contract {
    id?: number;
    exactDeliveryTime: number[];
    hospitalName: string;
    hospitalAddressLong: number;
    hospitalAddressLat: number;
    companyName: string;
    contractsOfEquipment: ContractEquipment[];
  }
  