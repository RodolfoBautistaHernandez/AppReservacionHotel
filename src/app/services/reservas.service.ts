import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { ReservacionRequest, ReservacionResponse } from '../models/Reserva.model';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private apiUrl: string = environment.apiReservas;

  constructor(private http: HttpClient) {}

  getReservaciones(): Observable<ReservacionResponse[]> {
    return this.http.get<ReservacionResponse[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener la reserva', error);
        return throwError(() => error);
      }),
    );
  }

  getReservacion(id: number): Observable<ReservacionResponse> {
    return this.http.get<ReservacionResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener la reserva', error);
        return throwError(() => error);
      }),
    );
  }

  postReservacion(reserva: ReservacionRequest): Observable<ReservacionResponse> {
    return this.http.post<ReservacionResponse>(this.apiUrl, reserva).pipe(
      catchError((error) => {
        console.error('Error al registrar la reserva', error);
        return throwError(() => error);
      }),
    );
  }

  putReservacion(reserva: ReservacionRequest, id: number): Observable<ReservacionResponse> {
    return this.http.put<ReservacionResponse>(`${this.apiUrl}/${id}`, reserva).pipe(
      catchError((error) => {
        console.error('Error al actualizar la reserva', error);
        return throwError(() => error);
      }),
    );
  }

  deleteReservacion(id: number): Observable<ReservacionResponse> {
    return this.http.delete<ReservacionResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar la reserva', error);
        return throwError(() => error);
      }),
    );
  }
}