import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { AuthInterceptor } from './shared/auth.interceptor';
import { ErrorInterceptor } from './shared/error.interceptor';
import { HuespedesComponent } from './components/huespedes/huespedes.component';
<<<<<<< HEAD

import { ReservacionComponent } from './components/reservas/reservas.component';

import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';

=======
import { ReservacionComponent } from './components/reservas/reservas.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
>>>>>>> 0f456b6987c861386c38e7b35103e40ec1295025

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UsuariosComponent,
    FooterComponent,
    NavbarComponent,
    LoginComponent,
    HuespedesComponent,
    ReservacionComponent,
    HabitacionesComponent
<<<<<<< HEAD

=======
>>>>>>> 0f456b6987c861386c38e7b35103e40ec1295025
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
