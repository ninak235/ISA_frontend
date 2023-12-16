import { CompanyAdminRegistration } from "../../user/model/companyAdminModel";

export interface AvailableDate {
    id?: number;
    admin: CompanyAdminRegistration | null;
    startTime: string;
    duration: Duration;
    adminConfirmationTime: Date;
    confirmed: boolean;
    selected: boolean;
  }

  export class Duration {
    milliseconds: number;
  }