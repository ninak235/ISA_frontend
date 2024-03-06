import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllEquipmentPreviewComponent } from './all-equipment-preview/all-equipment-preview.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    AllEquipmentPreviewComponent,
    EquipmentFormComponent
  ],
  imports: [
    CommonModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatSelectModule,
    MatFormFieldModule,
  ],
  exports: [AllEquipmentPreviewComponent, EquipmentFormComponent],
})
export class EquipmentModule { }
