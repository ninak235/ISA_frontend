import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Company } from '../model/companyModel';
import { CompanyService } from '../company.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'xp-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnChanges {
  @Input() company: Company;
  @Output() addCompanyClicked = new EventEmitter<void>();
  @Input() shouldEdit: boolean = false;
  @Input() oldCompanyName: string;
  
  renderCreateCompany: boolean = true;
  companies: Company[] = [];
  

  
  constructor(private service: CompanyService){
  }

  
  companyForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    grade: new FormControl('', [Validators.required])
  });

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

  addCompany(): void {
    const company: Company = {
      name: this.companyForm.value.name || '',
      locationDto: {  // Create a nested location object
        address: this.companyForm.value.address || '',
        city: this.companyForm.value.city || '',
        country: this.companyForm.value.country || '',
        longitude: 0,  // Provide default values or adjust as needed
        latitude: 0,
      },
      description: this.companyForm.value.description || '',
      grade: this.companyForm.value.grade || '',
      equipmentSet: [],
      adminsSet: []
    };

    const address = `${company.locationDto.address}, ${company.locationDto.city}, ${company.locationDto.country}`;
    
    // Pozovi Geocoding API i postavi geografske podatke
    this.service.geocodeAddress(address).subscribe({
      next: (result: any) => {
        company.locationDto.latitude = result.geometry.location.lat;
        company.locationDto.longitude = result.geometry.location.lng;
  
        // Nastavi sa dodavanjem ili ažuriranjem kompanije
        this.service.addCompany(company).subscribe({
          next: () => {
            this.addCompanyClicked.emit();
            this.companyForm.reset();
      
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
      },
      error: (error: any) => {
        console.error('Error geocoding address', error);
      },
    });
  
    
  }

  updateCompany(): void {
    const updatedCompany: Company = {
      name: this.companyForm.value.name || '',
      locationDto: {  // Create a nested location object
        address: this.companyForm.value.address || '',
        city: this.companyForm.value.city || '',
        country: this.companyForm.value.country || '',
        longitude: 0,  // Provide default values or adjust as needed
        latitude: 0,
      },
      description: this.companyForm.value.description || '',
      grade: this.companyForm.value.grade || '',
      equipmentSet: this.company.equipmentSet,
      adminsSet: this.company.adminsSet
    };

    const address = `${updatedCompany.locationDto.address}, ${updatedCompany.locationDto.city}, ${updatedCompany.locationDto.country}`;
    
    // Pozovi Geocoding API i postavi geografske podatke
    this.service.geocodeAddress(address).subscribe({
      next: (result: any) => {
        updatedCompany.locationDto.latitude = result.geometry.location.lat;
        updatedCompany.locationDto.longitude = result.geometry.location.lng;
  
        // Nastavi sa dodavanjem ili ažuriranjem kompanije
        this.service.updateCompany(this.oldCompanyName, updatedCompany).subscribe({
          next: () => {
            this.addCompanyClicked.emit();
            this.companyForm.reset();
      
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
      },
      error: (error: any) => {
        console.error('Error geocoding address', error);
      },
    });
  
    
  }
  
}
