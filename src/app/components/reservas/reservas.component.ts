import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Roles } from '../../constanis/Roles';
import Swal from 'sweetalert2';
import { ReservacionRequest, ReservacionResponse } from '../../models/Reserva.model';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ReservasService } from '../../services/reservas.service';

declare var bootstrap: any;

@Component({
  selector: 'app-reservacion',
  standalone: false,
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css',
})
export class ReservacionComponent implements OnInit, AfterViewInit {
  protected reservaciones$!: Observable<ReservacionResponse[]>;
  protected textoModal: string = 'Registrar Reservación';
  protected reservasForm: FormGroup;
  protected esEditMode: boolean = false;
  private selectedReservas: ReservacionResponse | null = null;
  private selectedReservasId: number | null = null;
  private refresh$ = new BehaviorSubject<void>(undefined);

  @ViewChild('reservasModalRef')
  reservasModalEl!: ElementRef;
  private modalInstance!: any;

  constructor(
    private fb: FormBuilder,
    private reservasService: ReservasService,
    private authService: AuthService,
  ) {
    this.reservasForm = this.fb.group({
      idHuesped: [null, [Validators.required, Validators.min(1)]],
      idHabitaciones: [null, [Validators.required, Validators.min(1)]],
      fechaIngreso: ['', [Validators.required]],
      fechaSalida: ['', [Validators.required]],
    });
  }

  private formatearFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }

  private refrescarReservas(): void {
    this.refresh$.next();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.reservasModalEl.nativeElement, {
      keyboard: false,
    });
    this.reservasModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.reservasForm.reset();
      this.esEditMode = false;
      this.selectedReservas = null;
      this.selectedReservasId = null;
    });
  }

  toggleForm(): void {
    this.textoModal = 'Registrar Reservación';
    this.modalInstance.show();
  }

  public ngOnInit(): void {
    this.reservaciones$ = this.refresh$.pipe(
      switchMap(() => this.reservasService.getReservaciones()),
    );
  }

  protected onSubmit(): void {
    if (this.reservasForm.invalid) return;

    const formValue = this.reservasForm.getRawValue();

    const reservaData: ReservacionRequest = {
      ...formValue,
      fechaIngreso: this.formatearFecha(formValue.fechaIngreso),
      fechaSalida: this.formatearFecha(formValue.fechaSalida),
    };

    if (this.esEditMode && this.selectedReservas && this.selectedReservasId) {
      this.reservasService.putReservacion(reservaData, this.selectedReservasId).subscribe({
        next: (): void => {
          this.refrescarReservas();
          Swal.fire('Actualizado', 'Reservación actualizada correctamente', 'success');
          this.modalInstance.hide();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            html: `No se puede actualizar la reservación<br><small>${error.error?.message ?? ''}</small>`,
          });
        },
      });
      return;
    }

    this.reservasService.postReservacion(reservaData).subscribe({
      next: (): void => {
        this.refrescarReservas();
        Swal.fire('Registrado', 'Reservación registrada correctamente', 'success');
        this.modalInstance.hide();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: `No se puede registrar la reservación<br><small>${error.error?.message ?? ''}</small>`,
        });
      },
    });
  }

  protected editarReservacion(reservacion: ReservacionResponse): void {
    if (!reservacion.huesped || !reservacion.habitacion) return;

    this.esEditMode = true;
    this.selectedReservas = reservacion;
    this.selectedReservasId = reservacion.id;
    this.textoModal = 'Editando Reservación #' + reservacion.id;
    this.reservasForm.patchValue({
      idHuesped: reservacion.huesped.id,
      idHabitaciones: reservacion.habitacion.id,
      fechaIngreso: reservacion.fechaIngreso,
      fechaSalida: reservacion.fechaSalida,
    });
    this.modalInstance.show();
  }

  protected isAdmin(): boolean {
    return this.authService.hasRole(Roles.ADMIN);
  }

  protected deleteReservacion(reservacion: ReservacionResponse): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `La reservación #${reservacion.id} será eliminada`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservasService.deleteReservacion(reservacion.id).subscribe({
          next: () => {
            this.refrescarReservas();
            Swal.fire('Eliminado', 'Reservación eliminada correctamente', 'success');
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              html: `No se pudo eliminar la reservación<br><small>${error.error?.message ?? ''}</small>`,
            });
          },
        });
      }
    });
  }
}