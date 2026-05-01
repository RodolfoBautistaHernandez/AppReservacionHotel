import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DescripcionRoles, Roles } from '../../constanis/Roles';
import Swal from 'sweetalert2';
import { HuespedRequest, HuespedResponse } from '../../models/Huesped.model';

import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { HuespedService } from '../../services/huespedes.service';


declare var bootstrap: any;

@Component({
  selector: 'app-huespedes',
  standalone: false,
  templateUrl: './huespedes.component.html',
  styleUrl: './huespedes.component.css',
})
export class HuespedesComponent implements OnInit, AfterViewInit {
  protected huespedes$!: Observable<HuespedResponse[]>;
  protected textoModal: string = 'Registrar Huésped';
  protected huespedForm: FormGroup;
  protected esEditMode: boolean = false;
  private selectedHuesped: HuespedResponse | null = null;
  private selectedHuespedId: number | null = null;
  private refresh$ = new BehaviorSubject<void>(undefined);

  @ViewChild('huespedModalRef')
  huespedModalEl!: ElementRef;
  private modalInstance!: any;

  constructor(
    private fb: FormBuilder,
    private huespedesService: HuespedService,
    private authService: AuthService,
  ) {
    this.huespedForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      tipoDocumento: ['', [Validators.required]],  
      numeroDocumento: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
    });
  }

  private refrescarHuespedes(): void {
    this.refresh$.next();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.huespedModalEl.nativeElement, {
      keyboard: false,
    });
    this.huespedModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.huespedForm.reset();
      this.esEditMode = false;
      this.selectedHuesped = null;
      this.selectedHuespedId = null;
    });
  }

  toggleForm(): void {
    this.textoModal = 'Registrar Huésped';
    this.modalInstance.show();
  }

  public ngOnInit(): void {
    this.huespedes$ = this.refresh$.pipe(
      switchMap(() => this.huespedesService.getHuespedes()),
    );
  }

  protected onSubmit(): void {
    if (this.huespedForm.invalid) return;

    const huespedData: HuespedRequest = this.huespedForm.getRawValue();
    console.log("ffhffhjhj", huespedData)

    if (this.esEditMode && this.selectedHuesped && this.selectedHuespedId) {
      this.huespedesService.putHuesped(huespedData, this.selectedHuespedId).subscribe({
        next: (): void => {
          this.refrescarHuespedes();
          Swal.fire('Actualizado', 'Huésped actualizado correctamente', 'success');
          this.modalInstance.hide();
        },
        error: (error) => {
          console.log('Error al actualizar huésped: ', error);
          Swal.fire({
          icon: 'error',
          title: 'Error',
           html: `No se puede actualizar el huésped<br><small>${error.error?.message ?? ''}</small>`,
          });
        },
      });
      return;
    }

    this.huespedesService.postHuesped(huespedData).subscribe({
      next: (): void => {
        this.refrescarHuespedes();
        Swal.fire('Registrado', 'Huésped registrado correctamente', 'success');
        this.modalInstance.hide();
      },
      error: (error) => {
        console.log('Error al registrar huésped: ', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
           html: `No se puede registrar el huésped<br><small>${error.error?.message ?? ''}</small>`,
});
      },
    });
  }

  protected editarHuesped(huesped: HuespedResponse): void {
    this.esEditMode = true;
    this.selectedHuesped = huesped;
    this.selectedHuespedId = huesped.id;
    this.textoModal = 'Editando Huésped: ' + huesped.nombre + ' ' + huesped.apellidoPaterno;
    this.huespedForm.patchValue({ ...huesped });
    this.modalInstance.show();
  }

  protected isAdmin(): boolean {
    return this.authService.hasRole(Roles.ADMIN);
  }

  protected deleteHuesped(huesped: HuespedResponse): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `El huésped: ${huesped.nombre} ${huesped.apellidoPaterno} será eliminado`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.huespedesService.deleteHuesped(huesped.id).subscribe({
          next: () => {
            this.refrescarHuespedes();
            Swal.fire('Eliminado', 'Huésped eliminado correctamente', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar huésped: ', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              html: `No se pudo eliminar el huésped<br><small>${error.error?.message ?? ''}</small>`,
              });
          },
        });
      }
    });
  }
}
