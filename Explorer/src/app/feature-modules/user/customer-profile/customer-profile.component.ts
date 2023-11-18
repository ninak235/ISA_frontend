import { Component, OnInit } from '@angular/core';
import { Customer } from '../model/customer.model';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit{
  customer: Customer;
  //shouldRenderUpdateForm: boolean = false;
  constructor(private service: UserService, private router: Router   ) { }

  ngOnInit(): void {
    this.service.getById(1).subscribe({
      next: (c: Customer) => {
          this.customer = c;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  editProfile(): void {
    this.router.navigate(['/updateProfile/1']);
  }
}

