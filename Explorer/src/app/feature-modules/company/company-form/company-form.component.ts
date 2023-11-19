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
    adress: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    grade: new FormControl('', [Validators.required])
  });

  ngOnChanges(changes: SimpleChanges):void {
    this.companyForm.reset();
    console.log(this.shouldEdit);
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
      adress: this.companyForm.value.adress || '',
      description: this.companyForm.value.description || '',
      grade: this.companyForm.value.grade || '',
      equipmentSet: [],
    };
  
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
  }

  updateCompany(): void {
    const updatedCompany: Company = {
      name: this.companyForm.value.name || '',
      adress: this.companyForm.value.adress || '',
      description: this.companyForm.value.description || '',
      grade: this.companyForm.value.grade || '',
      equipmentSet: this.company.equipmentSet
    };

    console.log(updatedCompany);
    console.log(this.oldCompanyName);
  
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
  }


  
}
