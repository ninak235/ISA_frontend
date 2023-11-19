import { Component } from '@angular/core';
import { Company } from '../model/companyModel';
import { CompanyService } from '../company.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'xp-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent {
  company: Company;
  
  //shouldRenderUpdateForm: boolean = false;
  constructor(private companyService: CompanyService,  private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const companyName = params.get('companyName');
      if(companyName){
        this.companyService.getByName(companyName).subscribe({
          next: (c: Company) => {
            this.company = c;
          },
          error: (err: any) => {
            console.log(err);
          }
        });
      }
    });
  }
}
