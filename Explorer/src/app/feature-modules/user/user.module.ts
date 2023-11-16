import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomerRegistrationComponent],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  exports: [CustomerRegistrationComponent],
})
export class UserModule {}
