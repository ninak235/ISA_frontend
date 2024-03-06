import { Component } from '@angular/core';
import { CompanyAdminRegistration } from '../model/companyAdminModel';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-update-admin-profile',
  templateUrl: './update-admin-profile.component.html',
  styleUrls: ['./update-admin-profile.component.css']
})
export class UpdateAdminProfileComponent {
  admin: CompanyAdminRegistration;

  constructor(private route: ActivatedRoute, private service: UserService, private router: Router) {}

  ngOnInit(): void {
      this.route.paramMap.subscribe((params) => {
      const idUser = params.get('id');
      if (idUser) {
        this.service.getAdminById(parseInt(idUser)).subscribe({
          next: (a: CompanyAdminRegistration) => {
            this.admin = a;
            this.profileForm.patchValue(this.admin);
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
    this.profileForm.patchValue(this.admin);
  }

  profileForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      number: new FormControl('', [Validators.required])
  });

  updateProfile(): void {
    const updatedAdmin: CompanyAdminRegistration = {
      id: this.admin.id || 0,
      firstName: this.profileForm.value.firstName || '',
      lastName: this.profileForm.value.lastName || '',
      userName: this.admin.userName || '',
      email: this.admin.email,
      country: this.profileForm.value.country || '',
      city: this.profileForm.value.city || '',
      password: this.profileForm.value.password || '',
      number: this.profileForm.value.number || '',
      companyId: this.admin.companyId
    };
    console.log("ID: ", updatedAdmin.id)
    this.service.updateAdminProfile(updatedAdmin).subscribe({
      next: () => {
       this.router.navigate(['/adminProfile']);
      }
    });
  }
}
