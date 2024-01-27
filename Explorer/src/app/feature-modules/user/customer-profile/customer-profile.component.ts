import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
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
import { Role } from 'src/app/infrastructure/auth/model/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ReservationInfoDialogComponent } from '../../reservation/reservation-info-dialog/reservation-info-dialog.component';
import { CompanyAdmin, CompanyEquipment } from '../../company/model/companyModel';
import { CompanyAdminRegistration } from '../model/companyAdminModel';
import { ComplaintService } from '../../complaint/complaint.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Complaint } from '../../complaint/model/complaintModel';
import readQRCode  from 'jsqr';
import jsQR from 'jsqr';

interface ExtendedReservation extends Reservation {
  isPast? : boolean;
  isCancelEnabled?: boolean;
  isCurrentReservation?: boolean;
  isPending?: boolean;
}

@Component({
  selector: 'xp-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css'],
})
export class CustomerProfileComponent implements OnInit {
  customer: Customer;
  userId: number;
  reservations: Reservation[] = [];
  sortReservationCriterium: string = '';
  reservationTypeSelected: string = '';
  role: Role;
  isCustomer: boolean = false;
  pastReservations: ExtendedReservation[] = [];
  futureReservations: ExtendedReservation[] = [];
  allReservations: ExtendedReservation[] = [];
  isCurrentReservation: boolean = false;
  shouldRenderForm: boolean = false;
  complaintContent: string = '';
  selectedCompanyAdmin: CompanyAdminRegistration;
  companyAdmins: CompanyAdminRegistration[] = [];
  complaintForm: FormGroup;
  decodedText: string = '';


  //shouldRenderUpdateForm: boolean = false;
  constructor(
    private service: UserService,
    private compaintService: ComplaintService,
    private router: Router,
    private authService: AuthService,
    private reservationService: ReservationService,
    private appRef: ApplicationRef,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.complaintForm = this.fb.group({
      complaintContent: ['', Validators.required],
      selectedCompanyAdmin: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.user$.getValue().id;

    this.role = this.authService.user$.getValue().role;
    if (this.role.roles[0] == "ROLE_CUSTOMER"){
      this.isCustomer = true;
    }

    this.getReservations();
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

  
  getReservations(): void {
    this.reservationService.getPastUserReservations(this.userId).subscribe({
      next: (reservations: ExtendedReservation[]) => {
        this.pastReservations = reservations;
        this.pastReservations.forEach(res => {
          res.isPast = true;
          res.isCancelEnabled = true;

          if(res.status == ReservationStatus.Pending){
            res.isPending = true;
          }
          else{
            res.isPending = false;
          }
        });
        this.combineReservations();
      }
    })
    this.reservationService.getUserReservations(this.userId).subscribe({
      next: (reservations: ExtendedReservation[]) => {
        this.futureReservations = reservations;
        this.futureReservations.forEach(res => {
          res.isPast = false;

          if(res.status == ReservationStatus.Pending){
            res.isPending = true;
          }
          else{
            res.isPending = false;
          }

          const reservationDate = this.parseDateTime(res.dateTime);
          const currentDate = new Date();

          if (reservationDate.getMonth() == currentDate.getMonth() && reservationDate.getDay() == currentDate.getDay() && reservationDate.getHours() <= currentDate.getHours() && currentDate.getHours() <= reservationDate.getHours()+res.duration){ //&& reservationDate.getHours() <= currentDate.getHours() && currentDate.getHours() <= reservationDate.getHours()+res.duration){
            res.isCurrentReservation = true;
          }
          const timeDifferenceInHours = (reservationDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);
          
          if (timeDifferenceInHours <= 24) {
            res.isCancelEnabled = false;
          }
          else {
            res.isCancelEnabled = true;
          }
        });
        this.combineReservations();
      }
    })
  }


  private combineReservations(): void {
    if (this.pastReservations && this.futureReservations) {
      this.allReservations = this.pastReservations.concat(this.futureReservations);
      // Alternatively: this.allReservations = [...this.pastReservations, ...this.futureReservations];
    }
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
  
  private getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }
  
  


  parseDateTime(localDateTime: string | object): Date {
    if (typeof localDateTime === 'object' && localDateTime !== null) {
        localDateTime = localDateTime.toString(); 
    }
    const dateArray = localDateTime.split(',').map(Number);
    const parsedDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
    return parsedDate;
}

  onSortReservationChange(): void{
    switch (this.sortReservationCriterium) {
      case 'sortDateN':
        this.allReservations.sort((a, b) => {
          const dateA = this.parseDateTime(a.dateTime);
          const dateB = this.parseDateTime(b.dateTime);
  
          return dateB.getTime() - dateA.getTime();
      });
      break;

      case 'sortDateO':
        this.allReservations.sort((a, b) => {
          const dateA = this.parseDateTime(a.dateTime);
          const dateB = this.parseDateTime(b.dateTime);
  
          return dateA.getTime() - dateB.getTime();
      });
      break;
   
      case 'sortPriceH':
        //this.pastReservations.sort((a, b) => a.grade - b.grade);
        break;
      case 'sortPriceL':
        //this.pastReservations.sort((a, b) => a. - b.someNumber);
        break;
      case 'sortDurationS':
        this.allReservations.sort((a, b) => a.duration - b.duration);
        break;
      case 'sortDurationL':
        this.allReservations.sort((a, b) => b.duration - a.duration);
        break;
      default:
        break;
    }
  }

  onTypeReservationChange() : void {
    switch (this.reservationTypeSelected) {
      case 'past':
        this.allReservations = this.pastReservations;
        break;
      case 'incoming':
        this.allReservations = this.futureReservations;
        break;
      case 'both':
        this.combineReservations();
        break;
      default:
        break;
    }
  }

  compareDates(dateA: Date, dateB: Date): number {
    const timeA = dateA.getTime();
    const timeB = dateB.getTime();
  
    return timeA - timeB;
  }

createReservationInfoString(reservation: Reservation): string{
    let reservationInfo: string = `Reservation ID: ${reservation.id}, DateTime: ${reservation.dateTime}, Duration: ${reservation.duration}, Grade: ${reservation.grade}, Status: ${reservation.status}, Customer ID: ${reservation.customerId}, Company Admin ID: ${reservation.companyAdminId}`;

    const reservationEquipments: CompanyEquipment[] = reservation.reservationEquipments;
    reservationInfo += ', Reservation Equipments: ';
    
    for (const equipment of reservationEquipments) {
      reservationInfo += `[ID: ${equipment.id}, Name: ${equipment.name}, Description: ${equipment.description}, Grade: ${equipment.grade}, Price: ${equipment.price}]`;
    }

    return reservationInfo;
  }


  seeQR(reservation: Reservation): void{
    const reservationInfo = this.createReservationInfoString(reservation);

    const dialogRef = this.dialog.open(ReservationInfoDialogComponent, {
      width: '500px', // Set the width as needed
      data: { reservationInfo: reservationInfo },
    });
  }

  submitComplaint(): void{
        let compl: Complaint = {
          content: this.complaintForm.value.complaintContent || '',
          replay: '',
          companyAdminId: 3,
          customerId: this.userId
        }

        console.log(compl);
        this.compaintService.createCompaint(compl).subscribe(() => {
          alert('Complaint created successfully!');
          
        });
      
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

  async handleFileSelect(event: any) {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = await this.readFileAsDataURL(file);

      // Dekodiranje QR koda
      this.decodeQRCode(imageUrl);
    }
  }

  async readFileAsDataURL(file: File): Promise<string> {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  async decodeQRCode(imageUrl: string): Promise<void> {
    const image = new Image();
  
    // Postavljanje funkcije koja će se izvršiti nakon učitavanja slike
    image.onload = () => {
      // Kreiranje ImageData objekta
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
  
      if (context) {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);
        const imageData = context.getImageData(0, 0, image.width, image.height);
  
        // Dekodiranje QR koda kroz jsqr
        const code = jsQR(imageData.data, imageData.width, imageData.height);
  
        // Postavljanje rezultata
        if (code) {
          const slicedText = this.sliceTextFrom17th(code.data);
          this.decodedText = slicedText;
          this.cdr.detectChanges();
          //console.log(this.decodedText)
        } else {
          this.decodedText = 'Nije pronađen QR kod.';
          this.cdr.detectChanges();
        }
      } else {
        console.error('getContext returned null');
      }

      const idQR = parseInt(this.decodedText)

      this.pastReservations.forEach(pastRes => {
        if (pastRes.id === idQR) {
          // Dodavanje alert poruke
          alert(`The deadline for picking up equipment has passed! ${this.customer.firstName} ${this.customer.lastName} receives 2 penalty points.`);
      
          this.reservationService.cancelReservationQR(pastRes).subscribe({
            next: (result: CancelationModel) => {
              console.log(result);
              this.customer.penaltyPoints += 2;
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
      });

      this.futureReservations.forEach(futureRes => {
        if (futureRes.id === idQR) {
      
          this.reservationService.pickUpReservation(futureRes).subscribe({
            next: (result: CancelationModel) => {
              console.log(result);
              const index = this.reservations.findIndex(
                (r) => r.id === result.reservationId
              );
              if (index !== -1 && futureRes.status != ReservationStatus.PickedUp) {
                alert(`${this.customer.firstName} ${this.customer.lastName} has succesfully picked up his equipment !`);
                  this.reservations[index].status = ReservationStatus.PickedUp;
                  this.appRef.tick();
              }
              else{
                alert(`Already picked up!`);
              }
            },
            error: (error: any) => {
              console.error('Error canceling reservation:', error);
            },
          });
        }
      });
      
    };
  
    // Postavljanje izvora slike
    image.src = imageUrl;
  }
  
  sliceTextFrom17th(text: string): string {
    const startIndex = 16;
    const commaIndex = text.indexOf(',');

    if (commaIndex !== -1 && commaIndex > startIndex) {
      return text.slice(startIndex, commaIndex);
    } else {
      return text.slice(startIndex);
    }
  }
  
  
}
