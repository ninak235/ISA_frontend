import { Component, OnInit } from '@angular/core';
import { Customer } from '../model/customer.model';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';



@Component({
  selector: 'xp-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit{
  customer: Customer;
  penaltyPoints: number;
  userId: number;
  //shouldRenderUpdateForm: boolean = false;
  constructor(private service: UserService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.service.getCustomerById(
      this.userId = this.authService.user$.getValue().id).subscribe({
      next: (c: Customer) => {
        this.customer = c;
        this.penaltyPoints = c.penaltyPoints;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  editProfile(): void {
    this.router.navigate(['/updateCustomerProfile/1']);
  }
}

