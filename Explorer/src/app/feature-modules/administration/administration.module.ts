import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PositionSimulatorComponent } from './position-simulator/position-simulator.component';



@NgModule({
  declarations: [
  
    PositionSimulatorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
  ]
})
export class AdministrationModule { }
