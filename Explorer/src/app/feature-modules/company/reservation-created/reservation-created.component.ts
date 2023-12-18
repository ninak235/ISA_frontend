import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'xp-reservation-created',
  templateUrl: './reservation-created.component.html',
  styleUrls: ['./reservation-created.component.css']
})
export class ReservationCreatedComponent {

  constructor(public dialogRef: MatDialogRef<ReservationCreatedComponent>) {}
  closeDialog(): void {
    this.dialogRef.close();
  }
}
