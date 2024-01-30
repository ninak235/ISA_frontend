import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Company, LocationDto } from '../model/companyModel';
import { CompanyService } from '../company.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'xp-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnChanges, AfterViewInit  {
  @Input() company: Company;
  @Output() addCompanyClicked = new EventEmitter<void>();
  @Input() shouldEdit: boolean = false;
  @Input() oldCompanyName: string;
  
  renderCreateCompany: boolean = true;
  companies: Company[] = [];
  map: L.Map;
  marker: L.Marker;

  
  constructor(private service: CompanyService, private http: HttpClient){
  }

  
  companyForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    latitude: new FormControl(0, [Validators.required]),
    longitude: new FormControl(0, [Validators.required]),
    description: new FormControl('', [Validators.required]),
    grade: new FormControl('', [Validators.required])
  });

 
  ngAfterViewInit(): void {
    this.initializeMap();
  }
  ngOnChanges(changes: SimpleChanges):void {
    this.companyForm.reset();
    if(this.shouldEdit){
      this.companyForm.patchValue(this.company);
    }
    this.service.getAllCompanise().subscribe({
      next: (result: Company[]) => {
        this.companies = result;
      },
    });
  }

  private initializeMap(): void {
    const initialCoordinates: L.LatLngExpression = [45.245018, 19.837681];
    const initialZoomLevel: number = 10;

    this.map = L.map('map').setView(initialCoordinates, initialZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add a click event listener to the map
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      // Remove existing marker if present
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      // Get clicked coordinates
      const clickedCoordinates: L.LatLngExpression = event.latlng;

      // Add a new marker at the clicked coordinates
      this.marker = L.marker(clickedCoordinates).addTo(this.map);

      // Update the form controls with the clicked coordinates
      this.companyForm.patchValue({
        latitude: clickedCoordinates.lat,
        longitude: clickedCoordinates.lng
      });

      // Fetch location information based on coordinates (you may need a reverse geocoding service for this)
      this.fetchLocationInfo(clickedCoordinates.lat, clickedCoordinates.lng);
    });
  }

  private async fetchLocationInfo(latitude: number, longitude: number): Promise<void> {
    try {
      const locationInfo = await this.reverseGeocode(latitude, longitude);
      
      // Update form controls with location information
      this.companyForm.patchValue({
        latitude: latitude,
        longitude: longitude
      });
    } catch (error) {
      console.error('Error fetching location information', error);
    }
  }

  private async reverseGeocode(latitude: number, longitude: number): Promise<LocationDto> {
    const apiKey = '0c7c0190d392458da8694650a0641bcd';
    const geocodingUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(latitude + ',' + longitude)}&key=${apiKey}`;
  
    try {
      const response = await this.http.get(geocodingUrl).toPromise();
      console.log('Geocoding API Response:', response); // Log the entire response
  
      const data: any = response;
  
      if (data.results && data.results.length > 0) {
        const result = data.results[0].components;
        return {
          address: result.road || '',
          city: result.city || '',
          country: result.country || '',
          latitude: latitude,
          longitude: longitude
        };
      } else {
        return {
          latitude: latitude,
          longitude: longitude,
          address: '',
          city: '',
          country: ''
        };
      }
    } catch (error) {
      console.error('Error fetching location information', error);
      return {
        latitude: latitude,
        longitude: longitude,
        address: '',
        city: '',
        country: ''
      };
    }
  }
  

  addCompany(): void {
    const company: Company = {
      name: this.companyForm.value.name || '',
      locationDto: { 
        address: this.companyForm.value.address || '',
        city: this.companyForm.value.city || '',
        country: this.companyForm.value.country || '',
        latitude: this.companyForm.value.latitude || 0,
        longitude: this.companyForm.value.longitude || 0,
      },
      description: this.companyForm.value.description || '',
      grade: this.companyForm.value.grade || '',
      equipmentSet: [],
      adminsSet: []
    };
  
    this.service.addLocation(company.locationDto).subscribe({
      next: (location: LocationDto) => {
        console.log("iddd stigao?", location.id)
        company.locationDto.id = location.id;
        console.log("NOVA COMPANY_A", company)
        this.service.addCompany(company).subscribe({
      next: (response) => {
        // Handle success, if needed
        console.log('Company added successfully', response);
        this.addCompanyClicked.emit();
        this.companyForm.reset();
        this.map.removeLayer(this.marker);
  
        // Refresh the list of companies
        this.service.getAllCompanise().subscribe({
          next: (result: Company[]) => {
            this.companies = result;
          },
          error: (error: any) => {
            console.error('Error loading companies', error);
          },
        });
  
        this.renderCreateCompany = false;
      },
      error: (error) => {
        console.error('Error adding company', error);
        // Handle error (e.g., show an error message to the user)
      },
    });
      }
    });
    
  }
  
  
  updateCompany(): void {
    const updatedCompany: Company = {
      name: this.companyForm.value.name || '',
      locationDto: {  
        address: this.companyForm.value.address || '',
        city: this.companyForm.value.city || '',
        country: this.companyForm.value.country || '',
        latitude: this.companyForm.value.latitude || 0,
        longitude: this.companyForm.value.longitude || 0,
      },
      description: this.companyForm.value.description || '',
      grade: this.companyForm.value.grade || '',
      equipmentSet: this.company.equipmentSet,
      adminsSet: this.company.adminsSet
    };

    this.service.updateCompany(this.oldCompanyName, updatedCompany).subscribe({
          next: () => {
            this.addCompanyClicked.emit();
            this.companyForm.reset();
      
            this.map.removeLayer(this.marker);
            this.service.getAllCompanise().subscribe({
              next: (result: Company[]) => {
                this.companies = result;
              },
              error: (error: any) => {
                console.error('Error loading companies', error);
              },
            });
      
            this.renderCreateCompany = false;
          },
          error: (error: any) => {
            console.error('Error adding company', error);
          },
        });
      }

      
      
}
