import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.gurd';
import { Roles } from './constanis/Roles';
import { HuespedesComponent } from './components/huespedes/huespedes.component';
import { ReservacionComponent } from './components/reservas/reservas.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch:'full'},
  {path: 'login', component: LoginComponent},
  {path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard], children :[
  {path: "usuarios", component: UsuariosComponent, canActivate: [AuthGuard], data:{roles: [Roles.ADMIN]}},
  {path: "huespedes", component: HuespedesComponent, canActivate: [AuthGuard], data:{roles: [Roles.ADMIN]}},
  {path: "reservas", component: ReservacionComponent, canActivate: [AuthGuard], data:{roles: [Roles.ADMIN]}}
  ]},
  {path:'**', redirectTo: "dashboard" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
