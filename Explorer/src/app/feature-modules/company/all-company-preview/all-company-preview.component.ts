import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Company, CompanyAdmin } from '../model/companyModel';
import { CompanyService } from '../company.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { CompanyAdminBasicModel } from '../../user/model/companyAdminBasicModel';
import { CompanyAdminRegistration } from '../../user/model/companyAdminModel';
import { Role } from 'src/app/infrastructure/auth/model/user.model';
import { ReservationService } from '../../reservation/reservation.service';
import { CancelationModel, Reservation } from '../../reservation/model/reservation.model';
import { UserService } from '../../user/user.service';
import { Customer } from '../../user/model/customer.model';



@Component({
  selector: 'xp-all-company-preview',
  templateUrl: './all-company-preview.component.html',
  styleUrls: ['./all-company-preview.component.css'],
})
export class AllCompanyPreviewComponent implements OnInit {
  userId: number;
  companies: Company[] = [];
  renderCreateCompany: boolean = false;
  searchValue: String;
  filteredCompanies: Company[] = [];
  selectedGrade: string = ''; 
  selectedCompany: Company;
  sortCriteriumSelected: string = '';
  shouldEdit: boolean;
  oldCompanyName: string;
  companyAdmin: CompanyAdminBasicModel = { id: 0, companyId: 0 };
  tooManyPenaltyPoints: boolean = false;
  role: Role;
  isCustomer: boolean = false;
  isAdmin: boolean = false;
 
  constructor(private companyService: CompanyService, private router: Router, private authService: AuthService, private reservationService: ReservationService, private userService: UserService) {}

  ngOnInit(): void {
    this.refreshCompanyList(); // Initial load of companies

    this.role = this.authService.user$.getValue().role;
    if (this.role.roles[0] == "ROLE_CUSTOMER"){
      this.isCustomer = true;
    }
    else if (this.role.roles[0] = "ROLE_COMPANYADMIN"){
      this.isAdmin = true;
    }
    this.userId = this.authService.user$.getValue().id;
    this.checkPenaltyPoints();
  
    // Subscribe to the addCompanyClicked event
    this.companyService.addCompanyClicked.subscribe(() => {
      this.refreshCompanyList(); // Refresh the list of companies
      
    });
  }

  checkPenaltyPoints(): void {
    if (this.isCustomer) {
      this.userService.getCustomerById(this.userId).subscribe({
        next: (c: Customer) => {
          if (c.penaltyPoints >= 3) {
            this.tooManyPenaltyPoints = true;
            alert('You have too many penalty points. Cannot reserve anything new until next month.');
          } 
        },
      });
    }
  }
  
  
  refreshCompanyList(): void {
    this.companyService.getAllCompanise().subscribe({
      next: (result: Company[]) => {
        this.companies = result;
        console.log(this.companies);
        this.filteredCompanies = this.companies;
      },
    });
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
    this.refreshCompanyList();
    this.shouldEdit = false;
  }
  onSearchChange(): void {
    this.filterCompanies();
  }

  private filterCompanies(): void {
    this.filteredCompanies = this.companies.filter((c) =>
      c.name.toLowerCase().match(this.searchValue.toLowerCase()) ||
      c.locationDto.address.toLowerCase().match(this.searchValue.toLowerCase())
    );
  }
  onGradeChange(): void{
    this.companyService.getByGradeCompanies(this.selectedGrade).subscribe({
      next: (result: Company[]) => {
        this.filteredCompanies = result;
      }
    })
  }

  
  onCriteriumChange(): void{
    switch (this.sortCriteriumSelected) {
      case 'sortName':
        this.filteredCompanies.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'sortCity':
        this.filteredCompanies.sort((a, b) => a.locationDto.city.localeCompare(b.locationDto.city));
        break;
      case 'sortGradeH':
        this.filteredCompanies.sort((a, b) => a.grade.localeCompare(b.grade));
        break;
      case 'sortGradeL':
        this.filteredCompanies.sort((a, b) => b.grade.localeCompare(a.grade));
        break;
      default:
        break;
    }
  }

  onEditCompanyClicked(company: Company): void{
    this.shouldEdit = true;
    this.oldCompanyName = company.name;
    this.selectedCompany = company;
  }

  onCompanyNameClicked(company: Company): void{
    this.router.navigate(['/companyProfile/' + company.name]);
  }

  onReserve(company:Company) : void{
    this.router.navigate(['/comapnyProfileReserve/' + company.name]);
  }
}
