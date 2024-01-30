import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contract } from '../model/contract';
import { CompanyService } from '../company.service';
import { DatePipe } from '@angular/common';
import { LongLatModel } from '../model/longLatModel';
import { Company } from '../model/companyModel';
import { Router } from '@angular/router';


@Component({
  selector: 'xp-company-contracts',
  templateUrl: './company-contracts.component.html',
  styleUrls: ['./company-contracts.component.css']
})
export class CompanyContractsComponent implements OnInit {

  contracts: Contract[] = [];
   hospitalLocation: LongLatModel = {
    longitude: 0, 
    latitude: 0    
  };

  companyLocation: LongLatModel = {
    longitude: 0,
    latitude: 0   
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
              private service: CompanyService, 
              private datePipe: DatePipe, 
              private router: Router,
              private dialogRef: MatDialogRef<CompanyContractsComponent>) {
  }

  ngOnInit(): void {
    this.getCompanyContracts();
  }

  getCompanyContracts(): void{
      this.service.getCompanyContracts(this.data.companyName).subscribe({
        next: (contractList: Contract[]) => {
          this.contracts = contractList;
        }
      })
  }

  formatExactDeliveryTime(exactDeliveryTime: number[]): string {
    const date = new Date(exactDeliveryTime[0], exactDeliveryTime[1] - 1, exactDeliveryTime[2]);
    const time = `${exactDeliveryTime[3]}:${exactDeliveryTime[4]}`;
    return this.datePipe.transform(date, 'mediumDate') + ', ' + time;
  }

  isCancellationAllowed(contract: Contract): boolean {
    const twentyFourHoursInMillis = 24 * 60 * 60 * 1000; 

    const currentDate = new Date(); 
    const deliveryDate = new Date(contract.exactDeliveryTime[0], contract.exactDeliveryTime[1] - 1, contract.exactDeliveryTime[2]);

    return (deliveryDate.getTime() - currentDate.getTime()) > twentyFourHoursInMillis;
  }

  
  cancelDelivery(contract: Contract) {
    if (this.isCancellationAllowed(contract)) {
      this.service.cancelDelivery(contract.hospitalName).subscribe(() => {
      });
    } else {
      console.log("Delivery cannot be canceled because it's within 24 hours.");
    }
  }

  goToMapDelivery(contract: Contract){
     this.hospitalLocation.latitude = contract.hospitalAddressLat;
     this.hospitalLocation.longitude = contract.hospitalAddressLong;
     console.log("HOSPITALLLL: ", this.hospitalLocation)
     this.service.getByName(contract.companyName).subscribe({
      next: (company: Company) =>{
        this.companyLocation.latitude = company.locationDto.latitude;
        this.companyLocation.longitude = company.locationDto.longitude;
        
        console.log("COMPANYYY: ", this.hospitalLocation)
        const dataToSend = {
          hospitalLocation: JSON.stringify(this.hospitalLocation),
          companyLocation: JSON.stringify(this.companyLocation),
          day: JSON.stringify(contract.exactDeliveryTime)
        }
        console.log(dataToSend);
        this.dialogRef.close(); // Close the dialog
        this.router.navigate(['/positionSimulator'], { queryParams: dataToSend});
      }
     })
  }
}
