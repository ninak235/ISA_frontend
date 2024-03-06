import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllReservationsComponent } from './all-reservations/all-reservations.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ReservationInfoDialogComponent } from './reservation-info-dialog/reservation-info-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    AllReservationsComponent,
    ReservationInfoDialogComponent
  ],
  imports: [
    CommonModule, FullCalendarModule, QRCodeModule
  ]
})
export class ReservationModule { }
