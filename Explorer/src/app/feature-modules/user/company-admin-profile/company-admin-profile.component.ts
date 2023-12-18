import { Component } from '@angular/core';
import { CompanyAdminRegistration } from '../model/companyAdminModel';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Company } from '../../company/model/companyModel';
import { CompanyService } from '../../company/company.service';

@Component({
  selector: 'xp-company-admin-profile',
  templateUrl: './company-admin-profile.component.html',
  styleUrls: ['./company-admin-profile.component.css']
})
export class CompanyAdminProfileComponent {
  admin: CompanyAdminRegistration;
  company: Company;
  //shouldRenderUpdateForm: boolean = false;
  constructor(private userService: UserService, private companyService: CompanyService,  private router: Router   ) { }

  ngOnInit(): void {
    this.userService.getAdminById(1).subscribe({
      next: (a: CompanyAdminRegistration) => {
        this.admin = a;
        this.companyService.getById(this.admin.companyId).subscribe({
          next: (result: Company) => {
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

  editProfile(): void {
    this.router.navigate(['/updateAdminProfile/1']);
  }
}
