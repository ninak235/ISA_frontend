import { Component, Input } from '@angular/core';
import { CompanyAdminRegistration } from '../model/companyAdminModel';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Company } from '../../company/model/companyModel';
import { CompanyService } from '../../company/company.service';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth'


@Component({
  selector: 'xp-company-admin-profile',
  templateUrl: './company-admin-profile.component.html',
  styleUrls: ['./company-admin-profile.component.css']
})
export class CompanyAdminProfileComponent {
  admin: CompanyAdminRegistration;
  company: Company;
  renderCreateCompany: boolean = false;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, multiMonthPlugin],
    initialView: 'multiMonthYear', // Initial view (you can change this based on your preference)
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'multiMonthYear,dayGridMonth,timeGridWeek'
    },
    views: {
      timeGrid: {
        dayMaxEvents: 4 // Adjust the number of events displayed in timeGrid view
      },
      year: {
        type: 'dayGrid',
        duration: { years: 1 } // Display one year at a time
      }
    }
  };
  //shouldRenderUpdateForm: boolean = false;
  constructor(private userService: UserService, private companyService: CompanyService,  private router: Router   ) { }

  ngOnInit(): void {

    this.refreshCompanyList(); // Initial load of companies

    // Subscribe to the addCompanyClicked event
    this.userService.addCompanyClicked.subscribe(() => {
      this.refreshCompanyList(); // Refresh the list of companies
    });
    
  }
  refreshCompanyList() {
    this.userService.getAdminById(1).subscribe({
      next: (a: CompanyAdminRegistration) => {
        this.admin = a;
        this.companyService.getById(this.admin.companyId).subscribe({
          next: (result: Company) => {
            console.log(result);
            this.company = result;
          },
          error: (error: any) => {
            console.error('Error loading company', error);
          },
        });
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onAddCompany(): void {
    this.renderCreateCompany = true;

    this.userService.getAdminById(1).subscribe({
      next: (a: CompanyAdminRegistration) => {
        this.admin = a;
        this.companyService.getById(this.admin.companyId).subscribe({
          next: (result: Company) => {
            console.log(result);
            this.company = result;
          },
          error: (error: any) => {
            console.error('Error loading company', error);
          },
        });
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onAddCompanyClicked(): void {
    this.renderCreateCompany = false;
    this.refreshCompanyList();
  }

  editProfile(): void {
    this.router.navigate(['/updateAdminProfile/1']);
  }

  navigateToCalendar() {
    this.router.navigate(['/allReservations']);
  }

}
