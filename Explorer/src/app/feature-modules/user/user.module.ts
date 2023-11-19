import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

@NgModule({
  declarations: [CustomerRegistrationComponent, CustomerProfileComponent, UpdateProfileComponent],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  exports: [CustomerRegistrationComponent],
})
export class UserModule {}
