import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllReservationsComponent } from './all-reservations/all-reservations.component';
import { FullCalendarModule } from '@fullcalendar/angular';


@NgModule({
  declarations: [
    AllReservationsComponent
  ],
  imports: [
    CommonModule, FullCalendarModule
  ]
})
export class ReservationModule { }
