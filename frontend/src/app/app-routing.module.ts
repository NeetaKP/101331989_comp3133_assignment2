import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AuthenticationGuard } from './authentication.guard';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full' },
  {path: 'signup', component:SignupComponent},
  {path: 'login', component:LoginComponent},
  {path: 'list', component:EmployeeListComponent, canActivate: [AuthenticationGuard]},
  {path: 'add', component:AddEmployeeComponent, canActivate: [AuthenticationGuard]},
  {path: 'view/:id', component:ViewEmployeeComponent, canActivate: [AuthenticationGuard]},
  {path: 'edit/:id', component:AddEmployeeComponent, canActivate: [AuthenticationGuard]},
  {path: '**', redirectTo: 'list'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
