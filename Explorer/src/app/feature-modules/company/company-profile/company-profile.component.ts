import { Component, AfterViewInit, ViewEncapsulation, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Company, CompanyEquipment } from '../model/companyModel';
import { CompanyService } from '../company.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { Equipment } from '../../equipment/model/equipmentModel';
import { EquipmentService } from '../../equipment/equipment.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AvailableDate } from '../model/availableDateModel';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddAvailabledateFormComponent } from '../add-availabledate-form/add-availabledate-form.component';
import { CancelationModel, Reservation, ReservationStatus } from '../../reservation/model/reservation.model';
import { ReservationService } from '../../reservation/reservation.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { EventInput } from '@fullcalendar/core';
import { ReservationCalendar } from '../../reservation/model/reservationCalendar';
import jsQR from 'jsqr';
import { Customer } from '../../user/model/customer.model';
import { UserService } from '../../user/user.service';
import { CompanyAdminRegistration } from '../../user/model/companyAdminModel';
import { CompanyContractsComponent } from '../company-contracts/company-contracts.component';

interface ExtendedReservation extends Reservation {
  isPast? : boolean;
  isCancelEnabled?: boolean;
  isCurrentReservation?: boolean;
  isPending?: boolean;
}

@Component({
  selector: 'xp-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent {
  company: Company;                               //kompanija
  map: L.Map;                                     //mapa
  shouldShowEquipmentComponent = false;
  filteredEquipment: CompanyEquipment[];          //pretrazena oprema
  equipmentSearchValue: string;                   //searchbox za pretragu equipmenta
  
  shouldRenderEquipmentForm: boolean = false;     //da li da otvori formu za izmenu opreme
  equipmentForUpdate: CompanyEquipment;           //oprema koju smo krenuli da izmenimo
  shouldRenderEquipmentSelect: boolean = true;   //plus za dodavanje nove opreme
  selectedEquipmentId: number;          //selektovan equipment iz liste za dodavanje nove opreme
  availableEquipment: Equipment[];      //oprema koju firma ima u ponudi -----------------------------DODAJ DA SE PROVERI I DA LI IMA DOVOLJAN QUANTITY >= 1
  showDatePicker: boolean = false;      //prikazivanje date pickera za kreiranje novog termina
  selectedDate: Date;                   //selektovan datum za kreiranje novog termina
  availableTimeSlots: AvailableDate[]; //ponudjeni termini za admina za datum koji je izabrao
  selectedTimeSlot: AvailableDate;    //prototip napravljenog termina koji selektujem da bih napravio slobodan termin
  existingTimeSlots: AvailableDate[]; //vec napravljeni slobodni termini admina
  adminId: number;  
  equipmentReservationStatus: { [key: number]: boolean } = {}; //mapa za svaku opremu da li postoji rezervacija unutar te firme sa njom, ------------------- TREBA IZMENITI TAKO DA UCITAVA I KOLICINU OPREME 
  shouldShowDatesComponent: boolean = false;
  shouldRenderAdmins: boolean =false;
  pastReservations: ExtendedReservation[] = [];
  futureReservations: ExtendedReservation[] = [];
  allReservations: ExtendedReservation[] = [];
  shouldShowReservations: boolean = false;
  decodedText: string = '';
  shouldCustomersRender: boolean = false;
  shouldAddEquipment: boolean = false;
  shouldShowDateChoose: boolean = false;
  constructor(private dialog: MatDialog, private companyService: CompanyService, private userService: UserService,  private equipmentService: EquipmentService, private reservationService: ReservationService,  private router: Router, private route: ActivatedRoute, private authService: AuthService, private appRef: ApplicationRef,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.adminId = user.id;
        var companyId;
        this.companyService.getAdmin(user.id)
        .subscribe({
          next: (admin : CompanyAdminRegistration) => {
            if (admin.id !== undefined) {
              this.adminId = admin.id;
            } else {
                console.log('CANNOT FIND THE ID');
            }
            this.companyService.getById(admin.companyId)
            .subscribe({
              next: (company: Company) => {
                if (company.id !== undefined) {
                  this.company = company;
                  console.log('MEEEDIC TRECI PUT');
                  console.log(this.company);
                  this.ngAfterViewInit();
                } else {
                  console.log('CANNOT FIND THE ID');
                }
              },
              error: (err: any) => {
                console.log('This admins company cannot be found in our database!', err);
              }
            })
          }, 
          error: (err: any) => {
            console.log('Looks like you arent logged in as an company admin', err);
          },
        });
        this.loadAdminAvailableDates();
        this.getReservations();
      }
    });
  }

  getReservations(): void {
    this.reservationService.getPastAdminReservations(this.adminId).subscribe({
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
    this.reservationService.getCompanyAdminReservations(this.adminId).subscribe({
      next: (reservations: ExtendedReservation[]) => {
        this.futureReservations = reservations;
        console.log("MEDIC DRUGI PUT");
        console.log(this.futureReservations);
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

  cancelReservation(): void {
    
  }
  
  private loadAdminAvailableDates() {
    this.companyService.getAdminAvailableDates(this.adminId).subscribe({
      next: (result) => {
        this.existingTimeSlots = result;
        console.log('ADMINOVI DATUMMI');
        console.log(this.existingTimeSlots);
        this.updateCalendarEvents();
      },
      error: (err) => {
        console.log('Error while getting admins available dates', err);
      }
    });
  }
  

  ngAfterViewInit(): void {
      if (this.company) {
            console.log('KOMPANIJA');
            console.log(this.company);
            for (const equipment of this.company.equipmentSet) {
              this.isItReserved(equipment);
            }
            if (this.company && this.company.locationDto) {
              let DefaultIcon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
                iconAnchor: [12, 41],
              });
  
              L.Marker.prototype.options.icon = DefaultIcon;
              setTimeout(() => {
                this.initMap(this.company.locationDto.address);
  
                // Fetch all equipment after the company is available
                this.equipmentService.getAllEquipments().subscribe({
                  next: (allEquipment) => {
                    this.availableEquipment = allEquipment.filter(equipment =>
                      !this.company.equipmentSet.some(companyEquipment =>
                        companyEquipment.id === equipment.id
                      )
                    );

                    console.log(this.availableEquipment);

                  },
                  error: (error) => {
                    console.error('Error fetching equipment:', error);
                    // Handle error as needed
                  },
                });
              }, 0);
            }    
      }
    
  }
  


  private initMap(address: string): void {
    if (this.map){
      this.map.remove();
    }
    const apiKey = '0c7c0190d392458da8694650a0641bcd';
    const geocodingUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;
  
    fetch(geocodingUrl)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const coordinates = data.results[0].geometry;
          console.log('Coordinates:', coordinates);
  
          this.map = L.map('leafletMap', { center: [coordinates.lat, coordinates.lng], zoom: 13 });
        
          const tiles = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              maxZoom: 18,
              minZoom: 3,
              attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }
          );

          tiles.addTo(this.map);
          L.marker([coordinates.lat, coordinates.lng]).addTo(this.map);
        } else {
          console.error('No results found for the given address.');
        }
      })
      .catch(err => {
        console.error('Error fetching coordinates', err);
        // Provide user feedback if necessary
      });
  }

  onEquipmentSearchChange(): void {
    this.filterEquipment();
  }
  
  private filterEquipment(): void {
    this.filteredEquipment = this.company.equipmentSet.filter((equipment) =>
      equipment.name.toLowerCase().includes(this.equipmentSearchValue.toLowerCase()) ||
      equipment.description.toLowerCase().includes(this.equipmentSearchValue.toLowerCase())
    );

    for (const equipment of this.filteredEquipment) {
      this.isItReserved(equipment);
    }
    
  }

  deleteEquipment(equipment: CompanyEquipment): void {
    const index = this.company.equipmentSet.indexOf(equipment);
    if (index !== -1) {
      this.company.equipmentSet.splice(index, 1);
      this.updateCompany(equipment.id!);
    }
  
    // Now, call the updateCompany method to update the company on the server
    
  }

  private updateCompany(oldId: number): void {
    console.log('Usao u apdejt');
    console.log(oldId);
    console.log(this.company);
    this.companyService.deleteCompanyEquipment(this.company, oldId).subscribe({
      next: () => {
        console.log('Company updated successfully');
        // You can add any additional logic or feedback here
      },
      error: (err: any) => {
        console.error('Error updating company:', err);
        // Handle error as needed (e.g., show an error message)
      }
    });
  }

  openUpdateEquipmentForm(equipment: CompanyEquipment): void {
    // Set the form values using patchValue with the equipment details
    // this.equipmentForm.patchValue({
      // name: equipment.name,
      // description: equipment.description,
      // typeOfEquipment: equipment.typeOfEquipment,
      // grade: equipment.grade,
      // price: equipment.price,
      // Add other equipment properties as needed
      this.equipmentForUpdate = equipment;
      this.shouldRenderEquipmentForm = true;
      console.log(this.equipmentForUpdate)
      console.log(this.shouldRenderEquipmentForm)
    // });
  }

  showEquipmentSelect(): void {
    this.shouldAddEquipment = !this.shouldAddEquipment;
  }

  addEquipment() {
    this.shouldAddEquipment = !this.shouldAddEquipment;
    this.companyService.addEquipmentToCompany(this.company.name, this.selectedEquipmentId).subscribe({
      next:() => {
        console.log('Equipment added successfully');
        this.selectedEquipmentId = 0;
        this.ngOnInit();
        
        
        // You can add any additional logic or feedback here
      },
      error: (err: any) => {
        console.error('Error adding the equipment company:', err);
        this.selectedEquipmentId = 0;
        // Handle error as needed (e.g., show an error message)
      }
    });
    // Call your equipmentService method here with this.selectedEquipment
    // Reset the selectedEquipment after adding
    
  }

  updateEquipmentClicked(): void{
    this.shouldRenderEquipmentForm = false;
    this.ngAfterViewInit();
  }

  openDatePicker() {
    this.showDatePicker = true;
  }

  onDateSelected(event: MatDatepickerInputEvent<Date>): void {
    if (event.value !== null) {
      this.selectedDate = event.value;
      const tempDate = new Date(this.selectedDate);
      tempDate.setUTCDate(tempDate.getUTCDate() + 1);

      console.log('Selected Date: ', this.selectedDate);
  
      // Format the date string with the corrected day
      const dateString: string = tempDate.toISOString();

  
      // Call your method from the company service here
      this.companyService.getExtraAdminAvailableDates(this.company.name, this.adminId, dateString).subscribe({
        next: (result) => {
          console.log('TIMESLOTS');
          console.log(result);
          this.availableTimeSlots = result;
        },
        error: (err:any) => {
          console.error('Error getting the available dates', err);
        }
      })
    }
  }

  createPickupTerm(): void {
    this.shouldShowDateChoose= !this.shouldShowDateChoose;
    if(this.selectedTimeSlot){
      this.companyService.createAvailableDate(this.selectedTimeSlot).subscribe({
        next: () => {
          console.log(this.selectedTimeSlot);
          this.ngOnInit();
        }
        ,
        error: (err:any) => {
          console.log('There has been a error:', err);
        }
      })
    }
    // Call your company service method to create the pickup term using selectedTimeSlot
    // You can use this.selectedTimeSlot to get the selected time slot ID or other information
    // Reset the selectedTimeSlot after creating the pickup term
  } 

  formatDateAndTime(localDateTime: string | object): { date: string, time: string } {
    if (typeof localDateTime === 'object' && localDateTime !== null) {
      localDateTime = localDateTime.toString(); 
    }
  
    const dateTimeParts = localDateTime.split(',');
  
    const [year, month, day, hours, minutes] = dateTimeParts;
    const dateString = `${year}-${month}-${day}`;
    var timeString = '';
    
    timeString = `${hours}:${minutes}` + '0';
 
   
    
  
    return { date: dateString, time: timeString };
  }

calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth', // Set initial view to dayGridMonth
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    views: {
      timeGrid: {
        dayMaxEvents: 4
      }
    },
  
    eventClick: (info) => {
      // Your eventClick logic
    },
  
    events: [] as EventInput[]
  };
  

  updateCalendarEvents(): void {
    // Assuming your FullCalendar events should have 'id', 'title', 'start', 'end', etc.
    const events: EventInput[] = this.existingTimeSlots.map((timeSlot) => {
      const dateTimeArray = timeSlot.startTime;
      
      // Use the Date constructor to create a Date object from the array
      const dateObject = new Date(+dateTimeArray[0], +dateTimeArray[1] - 1, +dateTimeArray[2], +dateTimeArray[3], +dateTimeArray[4]);
  
      return {
        id: String(timeSlot.id), // Convert id to string
        title: `Duration: ${timeSlot.duration / 60} minutes`,
        start: dateObject, // Use the Date object for the 'start' property
      };
    });
  
    // Update the calendar events
    this.calendarOptions.events = events;
  }

  

  isItReserved(eq: CompanyEquipment): void {
    console.log('Provera za');
    console.log(eq);
    if (this.company.id !== undefined && eq.id !== undefined) {
      this.equipmentService.checkIfEquipmentIsReserved(eq.id, this.company.id).subscribe({
        next: (result: boolean) => {
          if(eq.id !== undefined)
          this.equipmentReservationStatus[eq.id] = result;
        },
        error: (error: any) => {
          console.error('Error checking reservation status', error);
          if(eq.id !== undefined)
          this.equipmentReservationStatus[eq.id] = false; // or handle the error case accordingly
        },
      });
    } else {
      // Handle the case where either eq or eq.id is undefined
      // You might want to log an error or handle this case appropriately
    }
  }

  toggleEquipmentComponent() {
    this.shouldShowEquipmentComponent = !this.shouldShowEquipmentComponent;
  }

  toggleAdminsVisibility() {
    this.shouldShowDatesComponent = !this.shouldShowDatesComponent;
  }

  toggleReservationsVisibility() {
    this.shouldShowReservations = !this.shouldShowReservations;
  }

  toggleCompanyAdminsVisibility(){
    this.shouldRenderAdmins = !this.shouldRenderAdmins;
    }

    toggleCompanyCustomersVisibility(){
    this.shouldCustomersRender = !this.shouldCustomersRender;
    }

  parseDateTime(localDateTime: string | object): Date {
    if (typeof localDateTime === 'object' && localDateTime !== null) {
        localDateTime = localDateTime.toString(); 
    }
    const dateArray = localDateTime.split(',').map(Number);
    const parsedDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
    return parsedDate;
  }



  //OVA FUNKCIJA MOZE DA SE BRISE?
  isEquipmentReserved(equipment: CompanyEquipment): boolean {
    return equipment?.id !== undefined && this.equipmentReservationStatus[equipment.id];
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
          console.log("Decoded text: ",this.decodedText)
        } else {
          this.decodedText = 'Nije pronađen QR kod.';
          this.cdr.detectChanges();
        }
      } else {
        console.error('getContext returned null');
      }

      const idQR = parseInt(this.decodedText)
      this.processThePickup(idQR);
    };
  
    // Postavljanje izvora slike
    image.src = imageUrl;
  }

  processThePickup(idReservation: number): void {
    this.pastReservations.forEach(pastRes => {
      if (pastRes.id === idReservation && pastRes.status!=ReservationStatus.Cancelled) {
        // Dodavanje alert poruke
        this.userService.getCustomerById(pastRes.customerId).subscribe({
          next: (customer: Customer) => {
            alert(`The deadline for picking up equipment has passed! ${customer.firstName} ${customer.lastName} receives 2 penalty points.`);
    
            this.reservationService.cancelReservationQR(pastRes).subscribe({
              next: (result: CancelationModel) => {
                console.log(result);
                customer.penaltyPoints += 2;
                const index = this.allReservations.findIndex(
                  (r) => r.id === result.reservationId
                );
                if (index !== -1) {
                  this.allReservations[index].status = ReservationStatus.Cancelled;
                  this.appRef.tick();
                  
                }
              },
              error: (error: any) => {
                console.error('Error canceling reservation:', error);
              },
            });
          }
        });
      }
      else if(pastRes.status==ReservationStatus.Cancelled){
        alert(`The reservation is already cancelled!`);
      }
    });

    this.futureReservations.forEach(futureRes => {
      if (futureRes.id === idReservation && futureRes.status != ReservationStatus.PickedUp) {

        this.userService.getCustomerById(futureRes.customerId).subscribe({
          next: (customer: Customer) =>{
            const reservationDate = this.parseDateTime(futureRes.dateTime);
        const futureDate = this.parseDateTime(futureRes.dateTime);
    
        const additionalHours = futureRes.duration;
        futureDate.setHours(futureDate.getHours() + additionalHours);
    
        const currentDate = new Date();
    
        if (true) {
          this.reservationService.pickUpReservation(futureRes).subscribe({
            next: (result: CancelationModel) => {
              console.log(result);
              const index = this.allReservations.findIndex(
                (r) => r.id === result.reservationId
              );
    
              if (index !== -1) {
                alert(`${customer.firstName} ${customer.lastName} has successfully picked up their equipment!`);
                this.allReservations[index].status = ReservationStatus.PickedUp;
                this.appRef.tick();
              }
            },
            error: (error: any) => {
              console.error('Error picking up reservation:', error);
            }
          });
        } else {
          alert(`Now you can't pick up this equipment, check again your date!`);
        }
          }
        })

        
      } else if(futureRes.status == ReservationStatus.PickedUp) {
        alert(`Already picked up!`);
      }
    });

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

  seeContracts(company: Company): void{
    const dialogRef = this.dialog.open(CompanyContractsComponent, {
      width: ' 700px', 
      height: '450px',
      data: { companyName: company.name } 
    });
  }
  
  

  


}
