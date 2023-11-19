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


@NgModule({
  declarations: [CustomerRegistrationComponent, CustomerProfileComponent, UpdateProfileComponent, CompanyAdminRegistrationComponent],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule],
  exports: [CustomerRegistrationComponent, CompanyAdminRegistrationComponent],
})
export class UserModule {}
