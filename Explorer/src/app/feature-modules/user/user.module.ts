import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CompanyAdminRegistrationComponent } from './company-admin-registration/company-admin-registration.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CompanyAdminProfileComponent } from './company-admin-profile/company-admin-profile.component';
import { UpdateAdminProfileComponent } from './update-admin-profile/update-admin-profile.component';
import { SystemAdminCreateComponent } from './system-admin-create/system-admin-create.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';



@NgModule({
  declarations: [CustomerRegistrationComponent, CustomerProfileComponent, UpdateProfileComponent, CompanyAdminRegistrationComponent, CompanyAdminProfileComponent, UpdateAdminProfileComponent, SystemAdminCreateComponent, UserProfileComponent],
  imports: [RouterModule, CommonModule, MaterialModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, FullCalendarModule],
  exports: [CustomerRegistrationComponent, CompanyAdminRegistrationComponent],
})
export class UserModule {}
