export interface AvailableDate {
    id?: number;
    adminId: number | 0;
    startTime: string;
    duration: number;
    adminConfirmationTime: Date;
    taken: boolean;
    selected: boolean;
  }