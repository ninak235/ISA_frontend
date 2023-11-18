import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Customer } from '../model/customer.module';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'xp-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  customer: Customer;

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerService.getById(1).subscribe({
      next: (c: Customer) => {
          this.customer = c;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
