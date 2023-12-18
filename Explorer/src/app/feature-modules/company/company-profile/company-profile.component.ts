import { Component } from '@angular/core';
import { Company, CompanyEquipment } from '../model/companyModel';
import { CompanyService } from '../company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipment } from '../../equipment/model/equipmentModel';
import { AvailableDate} from '../model/availableDateModel';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddAvailabledateFormComponent } from '../add-availabledate-form/add-availabledate-form.component';
import { Reservation, ReservationStatus } from '../../reservation/model/reservation.model';
import { ReservationService } from '../../reservation/reservation.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent {
  
}
