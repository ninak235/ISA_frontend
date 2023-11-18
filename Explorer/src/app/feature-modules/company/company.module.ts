import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCompanyPreviewComponent } from './all-company-preview/all-company-preview.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AllCompanyPreviewComponent],
  imports: [CommonModule, FormsModule],
  exports: [AllCompanyPreviewComponent],
})
export class CompanyModule {}
