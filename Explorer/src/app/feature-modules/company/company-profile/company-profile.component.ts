import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
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
import { Reservation, ReservationStatus } from '../../reservation/model/reservation.model';
import { ReservationService } from '../../reservation/reservation.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent {
  company: Company;
  filteredEquipment: CompanyEquipment[];
  equipmentSearchValue: string;
  map: L.Map;
  shouldRenderEquipmentForm: boolean = false;
  equipmentForUpdate: CompanyEquipment;
  shouldRenderEquipmentSelect: boolean = false;
  selectedEquipmentId: number;
  availableEquipment: Equipment[];
  showDatePicker: boolean = false;
  selectedDate: Date;
  availableTimeSlots: AvailableDate[];
  selectedTimeSlot: AvailableDate;

  
  //shouldRenderUpdateForm: boolean = false;
  constructor(private companyService: CompanyService, private equipmentService: EquipmentService,  private router: Router, private route: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.route.paramMap.subscribe((params) => {
      const companyName = params.get('companyName');
      if (companyName) {
        this.companyService.getByName(companyName).subscribe({
          next: (c: Company) => {
            this.company = c;
            console.log('KOMPANIJA');
            console.log(this.company);
            if (this.company && this.company.adress) {
              let DefaultIcon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
                iconAnchor: [12, 41],
              });
  
              L.Marker.prototype.options.icon = DefaultIcon;
              setTimeout(() => {
                this.initMap(this.company.adress);
  
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
          },
          error: (err: any) => {
            console.log(err);
          }
        });
      }
    });
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
    // Set the form values using patchValue with the equipment details
    // this.equipmentForm.patchValue({
      // name: equipment.name,
      // description: equipment.description,
      // typeOfEquipment: equipment.typeOfEquipment,
      // grade: equipment.grade,
      // price: equipment.price,
      // Add other equipment properties as needed
      this.shouldRenderEquipmentSelect = true;
      console.log(this.shouldRenderEquipmentSelect)
    // });
  }

  addEquipment() {
    this.companyService.addEquipmentToCompany(this.company.name, this.selectedEquipmentId).subscribe({
      next:() => {
        console.log('Equipment added successfully');
        this.selectedEquipmentId = 0;
        this.ngAfterViewInit();
        
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
  }

  openDatePicker() {
    this.showDatePicker = true;
  }

  onDateSelected(event: MatDatepickerInputEvent<Date>): void {
    if (event.value !== null) {
      this.selectedDate = event.value;
      const dateString: string = this.selectedDate.toISOString();
  
      // Call your method from the company service here
      this.companyService.getExtraAdminAvailableDates(this.company.name, 1, dateString).subscribe({
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
    if(this.selectedTimeSlot){
      this.companyService.createAvailableDate(this.selectedTimeSlot).subscribe({
        next: () => {
          console.log(this.selectedTimeSlot);
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


  
  

  


}
