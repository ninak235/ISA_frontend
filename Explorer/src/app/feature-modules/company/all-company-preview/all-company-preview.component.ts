import { Component, OnChanges, OnInit } from '@angular/core';
import { Company } from '../model/companyModel';
import { CompanyService } from '../company.service';

@Component({
  selector: 'xp-all-company-preview',
  templateUrl: './all-company-preview.component.html',
  styleUrls: ['./all-company-preview.component.css'],
})
export class AllCompanyPreviewComponent implements OnInit {
  companies: Company[] = [];
  renderCreateCompany: boolean = false;

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.refreshCompanyList(); // Initial load of companies

    // Subscribe to the addCompanyClicked event
    this.companyService.addCompanyClicked.subscribe(() => {
      this.refreshCompanyList(); // Refresh the list of companies
    });
  }
  refreshCompanyList(): void {
    this.companyService.getAllCompanise().subscribe({
      next: (result: Company[]) => {
        this.companies = result;
      },
    });
  }

  onAddCompany(): void {
    this.renderCreateCompany = true;

    this.companyService.getAllCompanise().subscribe({
      next: (result: Company[]) => {
        this.companies = result;
      },
      error: (error: any) => {
        console.error('Error loading companies', error);
      },
    });
  }
  onAddCompanyClicked(): void {
    this.renderCreateCompany = false;
  }
}
