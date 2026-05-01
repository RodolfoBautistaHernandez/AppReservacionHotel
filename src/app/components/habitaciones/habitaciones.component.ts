import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Roles } from '../../constanis/Roles';
import Swal from 'sweetalert2';
import { HabitacionRequest, HabitacionResponse } from '../../models/Habitacion.models';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { HabitacionService } from '../../services/habitacion.service';

declare var bootstrap: any;

@Component({
  selector: 'app-habitaciones',
  standalone: false,
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css',
})
export class HabitacionesComponent implements OnInit, AfterViewInit {
  protected habitaciones$!: Observable<HabitacionResponse[]>;
  protected textoModal: string = 'Registrar Habitación';
  protected habitacionForm: FormGroup;
  protected esEditMode: boolean = false;
  private selectedHabitacion: HabitacionResponse | null = null;
  private selectedHabitacionId: number | null = null;
  private refresh$ = new BehaviorSubject<void>(undefined);

  @ViewChild('habitacionModalRef')
  habitacionModalEl!: ElementRef;
  private modalInstance!: any;

  constructor(
    private fb: FormBuilder,
    private habitacionesService: HabitacionService,
    private authService: AuthService,
  ) {
    this.habitacionForm = this.fb.group({
      numeroHabitacion: [null, [Validators.required, Validators.min(1)]],
      tipoHabitacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      precio: [null, [Validators.required, Validators.min(1)]],
      capacidad: [null, [Validators.required, Validators.min(1)]],
    });
  }

  private refrescarHabitaciones(): void {
    this.refresh$.next();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.habitacionModalEl.nativeElement, {
      keyboard: false,
    });
    this.habitacionModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.habitacionForm.reset();
      this.esEditMode = false;
      this.selectedHabitacion = null;
      this.selectedHabitacionId = null;
    });
  }

  toggleForm(): void {
    this.textoModal = 'Registrar Habitación';
    this.modalInstance.show();
  }

  public ngOnInit(): void {
    this.habitaciones$ = this.refresh$.pipe(
      switchMap(() => this.habitacionesService.getHabitaciones()),
    );
  }

  protected onSubmit(): void {
    if (this.habitacionForm.invalid) return;

    const habitacionData: HabitacionRequest = this.habitacionForm.getRawValue();

    if (this.esEditMode && this.selectedHabitacion && this.selectedHabitacionId) {
      this.habitacionesService.putHabitacion(habitacionData, this.selectedHabitacionId).subscribe({
        next: (): void => {
          this.refrescarHabitaciones();
          Swal.fire('Actualizado', 'Habitación actualizada correctamente', 'success');
          this.modalInstance.hide();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            html: `No se puede actualizar la habitación<br><small>${error.error?.message ?? ''}</small>`,
          });
        },
      });
      return;
    }

    this.habitacionesService.postHabitacion(habitacionData).subscribe({
      next: (): void => {
        this.refrescarHabitaciones();
        Swal.fire('Registrado', 'Habitación registrada correctamente', 'success');
        this.modalInstance.hide();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: `No se puede registrar la habitación<br><small>${error.error?.message ?? ''}</small>`,
        });
      },
    });
  }

  protected editarHabitacion(habitacion: HabitacionResponse): void {
    this.esEditMode = true;
    this.selectedHabitacion = habitacion;
    this.selectedHabitacionId = habitacion.id;
    this.textoModal = 'Editando Habitación: ' + habitacion.numeroHabitacion;
    this.habitacionForm.patchValue({ ...habitacion });
    this.modalInstance.show();
  }

  protected isAdmin(): boolean {
    return this.authService.hasRole(Roles.ADMIN);
  }

  protected deleteHabitacion(habitacion: HabitacionResponse): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `La habitación número ${habitacion.numeroHabitacion} será eliminada`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.habitacionesService.deleteHabitacion(habitacion.id).subscribe({
          next: () => {
            this.refrescarHabitaciones();
            Swal.fire('Eliminado', 'Habitación eliminada correctamente', 'success');
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              html: `No se pudo eliminar la habitación<br><small>${error.error?.message ?? ''}</small>`,
            });
          },
        });
      }
    });
  }
}
