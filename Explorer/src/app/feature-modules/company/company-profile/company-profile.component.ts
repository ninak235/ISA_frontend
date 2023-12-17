import { Component } from '@angular/core';
import { Company, CompanyEquipment } from '../model/companyModel';
import { CompanyService } from '../company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipment } from '../../equipment/model/equipmentModel';
import { AvailableDate, Duration } from '../model/availableDateModel';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddAvailabledateFormComponent } from '../add-availabledate-form/add-availabledate-form.component';
import { Reservation, ReservationStatus } from '../../reservation/model/reservation.model';
import { ReservationService } from '../../reservation/reservation.service';

@Component({
  selector: 'xp-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent {
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
  
  constructor(private companyService: CompanyService,  private router: Router, private route: ActivatedRoute, 
    private datePipe: DatePipe, private dialog: MatDialog, private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const companyName = params.get('companyName');
      if(companyName){
        this.companyService.getByName(companyName).subscribe({
          next: (c: Company) => {
            this.company = c;
            this.filteredEquipments = c.equipmentSet;
            
            console.log("PRE");
            console.log("ID: ", c.id);
            this.companyService.getCompanyAvailableDates(this.company.id || 0).subscribe({
              next: (dates: AvailableDate[]) => {
                console.log("available dates: ",dates);
                 this.availableDates = dates;
              }
            })

          },
          error: (err: any) => {
            console.log(err);
          }
        });
      }
    });
  }

  selectEquipment(equipment: CompanyEquipment){
    const index = this.selectedEquipment.indexOf(equipment);
    if (index !== -1) {
       this.selectedEquipment.splice(index, 1);
    } else {
      this.selectedEquipment.push(equipment);
    }
    console.log(this.selectedEquipment)
  }

  isSelected(equipment: any): boolean {
    return this.selectedEquipment.includes(equipment);
  }

  doneChoosing(): void{
    if (this.selectedEquipment.length != 0)
      this.isDone = true;
  }

  onSearchChange(): void {
    this.filterEquipments();
  }
  
  private filterEquipments(): void {
    this.filteredEquipments = this.company.equipmentSet.filter((e) =>
      e.name.toLowerCase().match(this.searchValue.toLowerCase()) 
    );
  }

  formatDateAndTime(localDateTime: string | object): { date: string, time: string } {
    if (typeof localDateTime === 'object' && localDateTime !== null) {
      localDateTime = localDateTime.toString(); 
    }
  
    const dateTimeParts = localDateTime.split(',');
  
    const [year, month, day, hours, minutes] = dateTimeParts;
    const dateString = `${year}-${month}-${day}`;
    var timeString = '';
    if(this.shouldAdd0 == false){
      timeString = `${hours}:${minutes}`;
    }
    else{
      timeString = `${hours}:${minutes}0`;
    }
  
    return { date: dateString, time: timeString };
  }
  
  addDate() : void {
    const dialogRef = this.dialog.open(AddAvailabledateFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Data:', result.selectedDate);
        /*const formattedDate = result.selectedDate.toISOString().split('T')[0];
        const formattedTime = result.selectedTime;
        const dateTimeToSend = `${formattedDate} ${formattedTime}`;

        const newAvailableDate: AvailableDate = {
          admin: null,
          startTime: dateTimeToSend,
          duration: new Duration(),
          adminConfirmationTime: new Date(),
          confirmed: false,
          selected: false
        };

        this.companyService.createAvailableDate(newAvailableDate);*/
        result.selectedDate.setDate(result.selectedDate.getDate() + 1);
        const dateString: string = result.selectedDate.toISOString();
        this.companyService.getExtraAvailableDates(this.company.id || 0, dateString).subscribe({
          next: (result: AvailableDate[]) => {
              this.availableDates = result;
              this.shouldAdd0 = true;
          }
        });
      }
    });
  }

  reserve() : void{
    console.log("SELECTED_DATE: ", this.selectedDate);
    const [year, month, day, hour, minute] = this.selectedDate.startTime;

    const startDate = new Date(parseInt(year,10), parseInt(month,10)-1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute,10));

    const reservation: Reservation = {
      dateTime: startDate,
      duration: 2000,
      grade: 4,      
      status: ReservationStatus.Pending,
      customerId: 1,  //dodati token upotrebu
      companyAdminId: this.selectedDate.adminId|| 0,
    };

    this.reservationService.createReservation(reservation).subscribe({
      next: (reservation: Reservation) => {
        console.log('KREIRANO');
      }
    })
    
  }
  
}
