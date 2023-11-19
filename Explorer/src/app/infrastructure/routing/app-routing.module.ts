import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { CustomerRegistrationComponent } from 'src/app/feature-modules/user/customer-registration/customer-registration.component';
import { AllCompanyPreviewComponent } from 'src/app/feature-modules/company/all-company-preview/all-company-preview.component';
import { CompanyFormComponent } from 'src/app/feature-modules/company/company-form/company-form.component';
import { CompanyAdminRegistrationComponent } from 'src/app/feature-modules/user/company-admin-registration/company-admin-registration.component';
import { CustomerProfileComponent } from 'src/app/feature-modules/user/customer-profile/customer-profile.component';
import { UpdateProfileComponent } from 'src/app/feature-modules/user/update-profile/update-profile.component';
import { AllEquipmentPreviewComponent } from 'src/app/feature-modules/equipment/all-equipment-preview/all-equipment-preview.component';

const routes: Routes = [
  { path: '', component: AllCompanyPreviewComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: CustomerRegistrationComponent },

  {
    path: 'allCompanies',
    component: AllCompanyPreviewComponent,
  },
  {
    path: 'addCompany',
    component: CompanyFormComponent,
  },
  {
    path: 'registerCompanyAdmin',
    component: CompanyAdminRegistrationComponent,
  },
  { path: 'profile', component: CustomerProfileComponent },
  { path: 'updateProfile/:id', component: UpdateProfileComponent},
  { path: 'allEquipments', component: AllEquipmentPreviewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
