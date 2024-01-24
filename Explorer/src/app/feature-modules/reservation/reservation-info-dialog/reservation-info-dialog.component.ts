import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reservation-info-dialog',
  template: `
    <h2>Reservation Information</h2>
    <p>{{ data.reservationInfo }}</p>
    
    <qrcode [qrdata]="data.reservationInfo" [width]="256" [errorCorrectionLevel]="'M'"></qrcode>
  `,
})
export class ReservationInfoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { reservationInfo: string }) {}
}
