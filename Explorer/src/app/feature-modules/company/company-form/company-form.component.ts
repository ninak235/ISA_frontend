import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
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

  ngOnChanges():void {
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
  
}
