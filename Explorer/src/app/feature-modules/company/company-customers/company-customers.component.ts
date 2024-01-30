import { Component, OnInit } from '@angular/core';
import { Customer } from '../../user/model/customer.model';
import { CompanyService } from '../company.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ReservationService } from '../../reservation/reservation.service';
import { UserService } from '../../user/user.service';
import { CompanyAdminBasicModel } from '../../user/model/companyAdminBasicModel';
import { Company } from '../model/companyModel';
import { CompanyAdminRegistration } from '../../user/model/companyAdminModel';
import { ReservationCalendar } from '../../reservation/model/reservationCalendar';

import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'xp-company-customers',
  templateUrl: './company-customers.component.html',
  styleUrls: ['./company-customers.component.css']
})
export class CompanyCustomersComponent implements OnInit {
  customers: Customer[] = [];
  allCompanyAdmins: CompanyAdminRegistration[] = [];
  reservations: ReservationCalendar[] = [];
  companyAdmin: CompanyAdminBasicModel = {id: 0, companyId: 0};
  company: Company;

  constructor(private companyService: CompanyService, reservationsService: ReservationService, private router: Router, private authService: AuthService, private reservationService: ReservationService, private userService: UserService) {}

  ngOnInit(): void {
    this.companyAdmin.id = this.authService.user$.getValue().id;

    this.authService.user$.subscribe(user => {
      if(user){
        this.companyService.getAdmin(user.id).subscribe({
          next: (admin : CompanyAdminRegistration) => {
            if (admin.id !== undefined) {
              this.companyAdmin.id = admin.id;
            } else {
                console.log('CANNOT FIND THE ID');
            }
            this.companyAdmin.companyId = admin.companyId;
            console.log(this.companyAdmin);
            this.companyService.getAllCompanyAdmins(admin.companyId).subscribe({
              next: (admins: CompanyAdminRegistration[]) => {
                console.log(admins);
                this.allCompanyAdmins = admins;
                this.reservationService.getAllReservations().subscribe({
                  next: (reservations: ReservationCalendar[]) => {
                    this.reservations = reservations;
                    console.log('Preuzeo je sve rezervacije');
                    this.filterReservations();
                    this.fetchCustomerDetails();
                  },
                  error: (err: any) =>
                  {
                    console.log('Error accured while gathering reservations information', err);
                  }
                })
              },
              error: (err: any) => {
                console.log('Error finding admins working for this company', err);
              }
            })
          }, 
          error: (err: any) => {
            console.log('Looks like you arent logged in as an company admin', err);
          },
        });
      }
    });
  }

  private filterReservations(): void {
    if (this.allCompanyAdmins.length > 0 && this.reservations.length > 0) {
      // Create a Set to keep track of unique customerIds
      const uniqueCustomerIds = new Set<number>();
  
      // Filter reservations based on companyAdminId and unique customerId
      this.reservations = this.reservations.filter(reservation => {
        const isAdminIdIncluded = this.allCompanyAdmins.map(admin => admin.id).includes(reservation.companyAdminId);
        const isCustomerIdUnique = !uniqueCustomerIds.has(reservation.customerId);
  
        // If companyAdminId is included and customerId is unique, include the reservation
        if (isAdminIdIncluded && isCustomerIdUnique) {
          uniqueCustomerIds.add(reservation.customerId);
          return true;
        }
  
        return false;
      });
  
      console.log('FILTER');
    }
  }

  private fetchCustomerDetails(): void {
    const customerRequests = this.reservations.map(reservation =>
      this.userService.getCustomerById(reservation.customerId)
    );
  
    forkJoin(customerRequests).subscribe(customers => {
      this.customers = customers;
      console.log('Fetched customer details:', this.customers);
    });
  }
  

}
