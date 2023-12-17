import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCompanyPreviewComponent } from './all-company-preview/all-company-preview.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { EquipmentModule } from '../equipment/equipment.module';

@NgModule({
  declarations: [AllCompanyPreviewComponent, CompanyFormComponent, CompanyProfileComponent],
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatIconModule, EquipmentModule],
  exports: [AllCompanyPreviewComponent],
})
export class CompanyModule {}
