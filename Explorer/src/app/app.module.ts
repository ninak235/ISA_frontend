import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EquipmentModule } from './feature-modules/equipment/equipment.module';
import { AppRoutingModule } from './infrastructure/routing/app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './feature-modules/layout/layout.module';
import { UserModule } from './feature-modules/user/user.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './infrastructure/material/material.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './infrastructure/auth/jwt/jwt.interceptor';
import { CompanyModule } from './feature-modules/company/company.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatOptionModule } from '@angular/material/core';
import { ComplaintModule } from './feature-modules/complaint/complaint.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ReservationModule } from './feature-modules/reservation/reservation.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { LoyalityProgramModule } from './feature-modules/loyality-program/loyality-program.module';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    UserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AuthModule,
    HttpClientModule,
    CompanyModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatNativeDateModule,
    MatOptionModule,
    EquipmentModule,
    ComplaintModule,
    FullCalendarModule,
    MatDatepickerModule,
    MatDialogModule,
    ReservationModule,
    LoyalityProgramModule,
    QRCodeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
