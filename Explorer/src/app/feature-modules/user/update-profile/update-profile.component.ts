import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../model/customer.model';
import { UserService } from '../user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit, OnChanges {

  customer: Customer;

  constructor(private route: ActivatedRoute, private service: UserService, private router: Router) {}

  ngOnInit(): void {
      this.route.paramMap.subscribe((params) => {
      const idUser = params.get('id');
      if (idUser) {
        this.service.getById(parseInt(idUser)).subscribe({
          next: (c: Customer) => {
            this.customer = c;
            this.profileForm.patchValue(this.customer);
          },
          error: (err: any) => {
            console.log(err);
          }
        });
      }
      })
  }
  ngOnChanges(): void {
    this.profileForm.reset();
    this.profileForm.patchValue(this.customer);
  }

  profileForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      number: new FormControl('', [Validators.required]),
      occupation: new FormControl('', [Validators.required]),
      companyInfo: new FormControl('', [Validators.required]),
  });

  updateProfile(): void {
    const updatedCustomer: Customer = {
      firstName: this.profileForm.value.firstName || '',
      lastName: this.profileForm.value.lastName || '',
      country: this.profileForm.value.country || '',
      city: this.profileForm.value.city || '',
      password: this.profileForm.value.password || '',
      number: this.profileForm.value.number || '',
      occupation: this.profileForm.value.occupation || '',
      companyInfo: this.profileForm.value.companyInfo || '',
      email: this.customer.email 
    };
    console.log(updatedCustomer);
    this.service.updateProfile(updatedCustomer).subscribe({
      next: () => {
       this.router.navigate(['/profile']);
      }
    });
  }
    
}
