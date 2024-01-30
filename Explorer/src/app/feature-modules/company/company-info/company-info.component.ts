import { Component, Input } from '@angular/core';
import { Company } from '../model/companyModel';


@Component({
  selector: 'xp-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent {
  @Input() company: Company | undefined; // Input property to receive company information
}



