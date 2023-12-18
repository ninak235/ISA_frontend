import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCompanyPreviewComponent } from './all-company-preview/all-company-preview.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { AddAvailabledateFormComponent } from './add-availabledate-form/add-availabledate-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CompanyReserveComponent } from './company-reserve/company-reserve.component';
import { ReservationCreatedComponent } from './reservation-created/reservation-created.component';

@NgModule({
  declarations: [AllCompanyPreviewComponent, CompanyFormComponent, CompanyProfileComponent, AddAvailabledateFormComponent, CompanyReserveComponent, ReservationCreatedComponent],
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatIconModule, MatCheckboxModule,
    MatCardModule, MatDatepickerModule, MatNativeDateModule, MatDialogModule],
  exports: [AllCompanyPreviewComponent],
  providers: [
    DatePipe, 
  ],
})
export class CompanyModule {}
