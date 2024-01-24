import { Component, OnInit } from '@angular/core';
import { Customer } from '../model/customer.model';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import {
  CancelationModel,
  Reservation,
  ReservationStatus,
} from '../../reservation/model/reservation.model';
import { ReservationService } from '../../reservation/reservation.service';
import { ApplicationRef } from '@angular/core';

@Component({
  selector: 'xp-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css'],
})
export class CustomerProfileComponent implements OnInit {
  customer: Customer;
  userId: number;
  reservations: Reservation[] = [];
  //shouldRenderUpdateForm: boolean = false;
  constructor(
    private service: UserService,
    private router: Router,
    private authService: AuthService,
    private reservationService: ReservationService,
    private appRef: ApplicationRef
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.user$.getValue().id;
    this.service.getCustomerById(this.userId).subscribe({
      next: (c: Customer) => {
        this.customer = c;
        this.reservationService.getUserReservations(this.userId).subscribe({
          next: (result: Reservation[]) => {
            this.reservations = result;
          },
        });
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  editProfile(): void {
    this.router.navigate(['/updateCustomerProfile/1']);
  }

  formatDateAndTime(localDateTime: string | object): {
    date: string;
    time: string;
  } {
    if (typeof localDateTime === 'object' && localDateTime !== null) {
      localDateTime = localDateTime.toString();
    }

    const dateTimeParts = localDateTime.split(',');

    const [year, month, day, hours, minutes] = dateTimeParts;
    const dateString = `${year}-${month}-${day}`;
    var timeString = '';
    timeString = `${hours}:${minutes}`;

    return { date: dateString, time: timeString };
  }

  cancelReservation(reservation: Reservation): void {
    const confirmCancel = confirm(
      'Are you sure you want to cancel this reservation?'
    );

    if (confirmCancel) {
      this.reservationService.cancelReservation(reservation).subscribe({
        next: (result: CancelationModel) => {
          console.log(result);
          this.customer.penaltyPoints = result.updatedPoints;
          const index = this.reservations.findIndex(
            (r) => r.id === result.reservationId
          );
          if (index !== -1) {
            this.reservations[index].status = ReservationStatus.Cancelled;
            this.appRef.tick();
          }
        },
        error: (error: any) => {
          console.error('Error canceling reservation:', error);
        },
      });
    }
  }
}
