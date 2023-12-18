import { Component, OnInit } from '@angular/core';
import { Customer } from '../model/customer.model';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Reservation } from '../../reservation/model/reservation.model';
import { ReservationService } from '../../reservation/reservation.service';



@Component({
  selector: 'xp-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit{
  customer: Customer;
  penaltyPoints: number;
  userId: number;
  reservations: Reservation[] = [];
  //shouldRenderUpdateForm: boolean = false;
  constructor(private service: UserService, private router: Router, private authService: AuthService, private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.userId = this.authService.user$.getValue().id;
    this.service.getCustomerById(this.userId).subscribe({
      next: (c: Customer) => {
        this.customer = c;
        this.penaltyPoints = c.penaltyPoints;
        this.reservationService.getUserReservations(this.userId).subscribe({
          next: (result: Reservation[]) => {
            this.reservations = result;
          }
        })
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  editProfile(): void {
    this.router.navigate(['/updateCustomerProfile/1']);
  }

  formatDateAndTime(localDateTime: string | object): { date: string, time: string } {
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
  
}

