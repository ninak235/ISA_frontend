import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompanyAdminBasicModel } from '../../user/model/companyAdminBasicModel';
import { CompanyService } from '../company.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ReservationService } from '../../reservation/reservation.service';
import { UserService } from '../../user/user.service';
import { CompanyAdminRegistration } from '../../user/model/companyAdminModel';
import { CompanyFormComponent } from '../company-form/company-form.component';
import { Company } from '../model/companyModel';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'xp-company-admin-home',
  templateUrl: './company-admin-home.component.html',
  styleUrls: ['./company-admin-home.component.css']
})
export class CompanyAdminHomeComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  companyAdmin: CompanyAdminBasicModel = {id: 0, companyId: 0};
  company: Company;
  
  constructor(private companyService: CompanyService, private router: Router, private authService: AuthService, private reservationService: ReservationService, private userService: UserService) {}

  ngOnInit(): void {
    this.companyAdmin.id = this.authService.user$.getValue().id;

    this.authService.user$
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(user => {
      if(user){
        this.companyService.getAdmin(user.id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (admin : CompanyAdminRegistration) => {
            if (admin.id !== undefined) {
              this.companyAdmin.id = admin.id;
            } else {
                console.log('CANNOT FIND THE ID');
            }
            this.companyAdmin.companyId = admin.companyId;
            console.log(this.companyAdmin);
            this.companyService.getById(this.companyAdmin.companyId)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
              next: (company: Company) => {
                if (company.id !== undefined) {
                  this.company = company;
                  console.log(this.company);
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
      }
    });

  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  goToCompanyProfile(): void {
    this.router.navigate(['/companyProfile/', this.company.name]);
}


}
