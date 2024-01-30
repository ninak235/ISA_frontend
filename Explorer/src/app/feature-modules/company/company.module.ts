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
import { EquipmentModule } from '../equipment/equipment.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CompanyContractsComponent } from './company-contracts/company-contracts.component';

import { CompanyAdminHomeComponent } from './company-admin-home/company-admin-home.component';
import { RouterModule } from '@angular/router';
import { CompanyCustomersComponent } from './company-customers/company-customers.component';
import { UserModule } from '../user/user.module';
import { ManagePickupsComponent } from './manage-pickups/manage-pickups.component';
import { CompanyInfoComponent } from './company-info/company-info.component';

@NgModule({
  declarations: [AllCompanyPreviewComponent, CompanyFormComponent, CompanyProfileComponent, AddAvailabledateFormComponent, CompanyReserveComponent, ReservationCreatedComponent, CompanyAdminHomeComponent, CompanyCustomersComponent, ManagePickupsComponent, CompanyInfoComponent, CompanyContractsComponent],
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatIconModule, MatCheckboxModule,
    MatCardModule, MatDatepickerModule, MatNativeDateModule, MatDialogModule, EquipmentModule, BrowserAnimationsModule, FullCalendarModule, RouterModule, UserModule],
  exports: [AllCompanyPreviewComponent],
  providers: [
    DatePipe, 
  ],
})
export class CompanyModule {}
