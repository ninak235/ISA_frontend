import { Component } from '@angular/core';
import { ComEq, Company, CompanyEquipment } from '../model/companyModel';
import { CompanyService } from '../company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import {
  Reservation,
  ReservationEquipment,
  ReservationStatus,
} from '../../reservation/model/reservation.model';
import { ReservationService } from '../../reservation/reservation.service';
import { AddAvailabledateFormComponent } from '../add-availabledate-form/add-availabledate-form.component';
import { AvailableDate } from '../model/availableDateModel';
import { ReservationCreatedComponent } from '../reservation-created/reservation-created.component';

import { merge, of } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';

interface ExtendedEquipment extends CompanyEquipment {
   quantity?: number;
}


@Component({
  selector: 'xp-company-reserve',
  templateUrl: './company-reserve.component.html',
  styleUrls: ['./company-reserve.component.css'],
})
export class CompanyReserveComponent {
  company: Company;
  selectedEquipment: ExtendedEquipment[] = [];
  filteredEquipments: ExtendedEquipment[] = [];
  reservationEquipments: ReservationEquipment[] = [];
  searchValue: String;
  isEquipmentChoosen: boolean = false;
  isDone: boolean = false;
  availableDates: AvailableDate[] = [];
  shouldRenderAddDate: boolean = false;
  shouldAdd0: boolean = false;
  selectedDate: AvailableDate;
  userId: number;
  sumPrice: number = 0;

  constructor(
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.user$.getValue().id;
    this.route.paramMap.subscribe((params) => {
      const companyName = params.get('companyName');
      if (companyName) {
        this.companyService.getByName(companyName).subscribe({
          next: (c: Company) => {
            this.company = c;
            this.filteredEquipments = c.equipmentSet;

            this.companyService
              .getCompanyAvailableDates(this.company.id || 0, this.userId)
              .subscribe({
                next: (dates: AvailableDate[]) => {
                  dates.forEach((date) => {
                    if (date.taken == false) {
                      this.availableDates.push(date);
                    }
                  });
                },
              });
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      }
    });
  }

  selectEquipment(equipment: CompanyEquipment) {
    const index = this.selectedEquipment.indexOf(equipment);
    if (index !== -1) {
      this.selectedEquipment.splice(index, 1);
    } else {
      this.selectedEquipment.push(equipment);
    }
  }

  isSelected(equipment: any): boolean {
    return this.selectedEquipment.includes(equipment);
  }

  doneChoosing(): void {
    if (this.selectedEquipment.length != 0){
      this.selectedEquipment.forEach(elem => {
        this.companyService.getComEq(this.company.id|| 0,  elem.id || 0).subscribe({
          next: (comEq: ComEq) => {
            if(comEq.quantity >= (elem.quantity||0)){
                 this.isDone = true;
            }
            else{
              console.log("**********to much***********");
            }
          }
        })
      });
    } 
  }

  onSearchChange(): void {
    this.filterEquipments();
  }

  private filterEquipments(): void {
    this.filteredEquipments = this.company.equipmentSet.filter((e) =>
      e.name.toLowerCase().match(this.searchValue.toLowerCase())
    );
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
    if (this.shouldAdd0 == false) {
      timeString = `${hours}:${minutes}`;
    } else {
      timeString = `${hours}:${minutes}0`;
    }

    return { date: dateString, time: timeString };
  }

  addDate(): void {
    const dialogRef = this.dialog.open(AddAvailabledateFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.selectedDate.setDate(result.selectedDate.getDate() + 1);
        const dateString: string = result.selectedDate.toISOString();
        this.companyService
          .getExtraAvailableDates(this.company.id || 0, dateString, this.userId)
          .subscribe({
            next: (result: AvailableDate[]) => {
              this.availableDates = result;
              this.shouldAdd0 = true;
            },
          });
      }
    });
  }


reserve(): void {
  if (this.selectedDate != null) {
    const [year, month, day, hour, minute] = this.selectedDate.startTime;

    const startDate = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(hour, 10),
      parseInt(minute, 10)
    );
    startDate.setHours(startDate.getHours() + 1);

    const observables = this.selectedEquipment.map(equipment => {
      const resEq: ReservationEquipment = {
        equipmentName: equipment.name || '',
        quantity: equipment.quantity || 0,
      };
      this.reservationEquipments.push(resEq);
      return this.companyService.getEquipmentName(equipment.name).pipe(
        mergeMap((eq: CompanyEquipment) => {
          this.sumPrice += (eq.price * (equipment.quantity || 0));
          return of(null); // Return a dummy observable to keep the array consistent
        })
      );
    });

    // Wait for all observables to complete
    merge(...observables).pipe(
      toArray() // Wait for all observables to complete
    ).subscribe(() => {
      // SECOND PART
      const reservation: Reservation = {
        dateTime: startDate,
        duration: this.selectedDate.duration,
        grade: 4,
        status: ReservationStatus.Pending,
        customerId: this.userId,
        companyAdminId: this.selectedDate.adminId || 0,
        reservationOfEquipments: this.reservationEquipments,
        price: this.sumPrice,
      };
      this.selectedDate.taken = true;
      if(this.shouldAdd0 == false){
        this.companyService
            .updateAvailableDate(this.selectedDate)
            .subscribe({
              next: () => {
                this.reservationService.createReservation(reservation).subscribe({
                  next: () =>{
                    const dialogRef = this.dialog.open(ReservationCreatedComponent, {
                      width: '400px',
                    });
                    dialogRef.afterClosed().subscribe(() => {
                      this.router.navigate(['/allCompanies']);
                    });
                  }
                });
              }
            });
      }else{
        this.companyService
            .createAvailableDate(this.selectedDate)
            .subscribe({
              next: () => {
                this.reservationService.createReservation(reservation).subscribe({
                  next: () => {
                    const dialogRef = this.dialog.open(ReservationCreatedComponent, {
                      width: '400px',
                    });
                    dialogRef.afterClosed().subscribe(() => {
                      this.router.navigate(['/allCompanies']);
                    });
                  }
                });
              }
            });
      }

    }
    );
  }
}

    
  
}
