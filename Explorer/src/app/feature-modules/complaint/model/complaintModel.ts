export interface Complaint {
    id?: number;
    content: string;
    replay: string;
    disabled?: boolean;
    companyAdminId?: number;
    customerId?:number;
  }