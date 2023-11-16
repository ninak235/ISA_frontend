import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCompanyPreviewComponent } from './all-company-preview/all-company-preview.component';

@NgModule({
  declarations: [AllCompanyPreviewComponent],
  imports: [CommonModule],
  exports: [AllCompanyPreviewComponent],
})
export class CompanyModule {}
