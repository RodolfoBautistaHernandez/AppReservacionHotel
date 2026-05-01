export interface ReservacionRequest {
  idHuesped: number;
  idHabitaciones: number;
  fechaIngreso: string;  
  fechaSalida: string;   
}

export interface DatosHuesped {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  nacionalidad: string;
}

export interface DatosHabitacion {
  id: number;
  numeroHabitacion: string;
  tipoHabitacion: string;
  precio: string;
  capacidad: string;
}

export interface ReservacionResponse {
  id: number;
  idHuesped: number;        
  idHabitaciones: number;
  huesped?: DatosHuesped;
  habitacion?: DatosHabitacion;
  fechaIngreso: string;
  fechaSalida: string;
  estadoReservacion: string;
}