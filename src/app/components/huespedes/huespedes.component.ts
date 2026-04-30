import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsuarioRequest, UsuarioResponse } from '../../models/Usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DescripcionRoles, Roles } from '../../constanis/Roles';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../services/usuarios.service';
import { HuespedRequest, HuespedResponse } from '../../models/Huesped.model';
import { HuespedesService } from '../../services/huespedes.service';


declare var bootstrap: any;

@Component({
  selector: 'app-huespedes',
  standalone: false,
  templateUrl: './huespedes.component.html',
  styleUrl: './huespedes.component.css'
})
export class HuespedesComponent implements OnInit, AfterViewInit {

  textoModal: string = 'Registrar Huespedes';
  huespedes: HuespedResponse[] = [];
  huespedForm: FormGroup;
  roles: string[] =Object.values(Roles);
  isEditMode: boolean = false;
  selectedHuesped: HuespedResponse | null = null;

  @ViewChild('huespedModalRef')
  huespedModalEl!: ElementRef;

  private modalInstance!: any;
 

   constructor(
    private fb: FormBuilder,
    private huespedesService: HuespedesService

  ) {
    this.huespedForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      roles: [[], [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.listarHuespedes();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.huespedModalEl.nativeElement, { keyboard: false} );
    this.huespedModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetFrom();

    });
  }
  listarHuespedes(): void{
    this.huespedesService.getHuespedes().subscribe({
      next: resp => {
        this.huespedes = resp;
      },
      error: (error) =>{
        console.log('Erro al listar huespedes: ', error);
        Swal.fire('Error', 'No se pudieron cargar los huespedes', 'error');
      }
    })

  }

 /*  llenarLista(): void {
    this.usuarios = [
      { username: 'admin', roles: ['ROLE_ADMIN'] },
      { username: 'usuario', roles: ['ROLE_USER'] }
    ];
  } */

  toggleForm(): void {
    this.resetFrom();
    this.textoModal = 'Registrar Huesped';
    this.modalInstance.show();
  }
  resetFrom(): void{

    this.isEditMode = false;
    this.selectedHuesped = null;
    this.huespedForm.reset();
  }

  editarHuesped(huesped: HuespedResponse): void { 
    this.isEditMode = true;
    this.selectedHuesped = huesped;
    this.textoModal = 'Editando Huesped: ' + huesped.nombre;

    this.huespedForm.patchValue({...huesped});
    this.modalInstance.show();
  }

  transformarRol(rol: string): string{
    return DescripcionRoles[rol as Roles] || 'Desconocido';
  }

  onSubmit(): void {
    //console.info('Valor del formulario: ', this.usuarioForm.value)
    if(this.huespedForm.invalid)return;

    const huespedData: HuespedRequest = this.huespedForm.value;

    if(this.isEditMode && this.selectedHuesped){

      this.huespedesService.postHuesped(huespedData).subscribe({
      next: huespedActualizando =>{

        const index: number = this.huespedes.findIndex(huesped => huesped.nombre == this.selectedHuesped?.nombre);
        if(index !== -1) this.huespedes[index] = huespedActualizando;
        
    Swal.fire('Registrado', 'Huesped registrado correctamente', 'success');
    this.modalInstance.hiden();

      },
      error: (error) => {
        console.log('Error al registrar huesped: ', error);
        Swal.fire('Error', 'No se pudo registrar el huesped', 'error');
      }
    });

    } else{
      this.huespedesService.postHuesped(huespedData).subscribe({
      next: nuevoHuesped =>{
        this.huespedes.push(nuevoHuesped);
    Swal.fire('Registrado', 'Huesped registrado correctamente', 'success');
    this.modalInstance.hiden();

      },
      error: (error) => {
        console.log('Error al registrar huesped: ', error);
        Swal.fire('Error', 'No se pudo registrar el huesped', 'error');
      }
    });

    }
    
    

  }

  deleteHuesped(nombre: string): void {
    Swal.fire({
      title:'¿Estas seguro?',
      text: `El huesped ${nombre} será elimidado permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result =>{
      if(result.isConfirmed){
        this.huespedesService.deleteHuesped(nombre).subscribe({
          next: () => {
            this.huespedes = this.huespedes.filter(u => u.nombre !== nombre);
    Swal.fire('Eliminado', 'Huesped eliminado correctamente', 'success');
          },
          error: (error) => {
        console.log('Error al eliminar huesped: ', error);
        Swal.fire('Error', 'No se pudo eliminar el huesped', 'error');
      }
        });
    
      }
    });
    
  }

  }
  
