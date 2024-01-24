import { Component } from '@angular/core';
import { Company, CompanyEquipment } from '../model/companyModel';
import { CompanyService } from '../company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import {
  Reservation,
  ReservationStatus,
} from '../../reservation/model/reservation.model';
import { ReservationService } from '../../reservation/reservation.service';
import { AddAvailabledateFormComponent } from '../add-availabledate-form/add-availabledate-form.component';
import { AvailableDate } from '../model/availableDateModel';
import { ReservationCreatedComponent } from '../reservation-created/reservation-created.component';

@Component({
  selector: 'xp-company-reserve',
  templateUrl: './company-reserve.component.html',
  styleUrls: ['./company-reserve.component.css'],
})
export class CompanyReserveComponent {
  company: Company;
  selectedEquipment: CompanyEquipment[] = [];
  filteredEquipments: CompanyEquipment[] = [];
  searchValue: String;
  isEquipmentChoosen: boolean = false;
  isDone: boolean = false;
  availableDates: AvailableDate[] = [];
  shouldRenderAddDate: boolean = false;
  shouldAdd0: boolean = false;
  selectedDate: AvailableDate;
  userId: number;

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
    if (this.selectedEquipment.length != 0) this.isDone = true;
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

      const reservation: Reservation = {
        dateTime: startDate,
        duration: this.selectedDate.duration,
        grade: 4,
        status: ReservationStatus.Pending,
        customerId: this.userId,
        companyAdminId: this.selectedDate.adminId || 0,
        reservationEquipments: this.selectedEquipment || null,
      };

      this.reservationService.createReservation(reservation).subscribe({
        next: (reservation: Reservation) => {
          this.selectedDate.taken = true;
          if (this.shouldAdd0 == false) {
            this.companyService
              .updateAvailableDate(this.selectedDate)
              .subscribe();
          } else {
            this.companyService
              .createAvailableDate(this.selectedDate)
              .subscribe();
          }
          const dialogRef = this.dialog.open(ReservationCreatedComponent, {
            width: '400px',
          });

          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/allCompanies']);
          });
        },
      });
    }
  }
}
