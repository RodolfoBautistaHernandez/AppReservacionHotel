import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../environments/environment';
import {HabitacionRequest, HabitacionResponse} from '../models/Habitacion.models';

@Injectable({
  providedIn: 'root',
})
export class HabitacionService {
  private apiUrl: string = environment.apiHabitaciones;

  constructor(private http: HttpClient) {}

  getHabitaciones(): Observable<HabitacionResponse[]> {
    return this.http.get<HabitacionResponse[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener las habitaciones', error);
        return throwError(() => error);
      }),
    );
  }

  getHabitacion(id: number): Observable<HabitacionResponse> {
    return this.http.get<HabitacionResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener la habitación', error);
        return throwError(() => error);
      }),
    );
  }

  postHabitacion(habitacion: HabitacionRequest): Observable<HabitacionRequest> {
    return this.http.post<HabitacionResponse>(this.apiUrl, habitacion).pipe(
      catchError((error) => {
        console.error('Error al registrar la habitacion', error);
        return throwError(() => error);
      }),
    );
  }

  putHabitacion(habitacion: HabitacionRequest, id: number): Observable<HabitacionResponse> {
    return this.http.put<HabitacionResponse>(`${this.apiUrl}/${id}`, habitacion).pipe(
      catchError((error) => {
        console.error('Error al actualizar la habitacion', error);
        return throwError(() => error);
      }),
    );
  }

  deleteHabitacion(id: number): Observable<HabitacionResponse> {
    return this.http.delete<HabitacionResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar la habitacion', error);
        return throwError(() => error);
      }),
    );
  }
}
