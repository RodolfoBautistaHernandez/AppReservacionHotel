import { Injectable } from "@angular/core";
import { enviroment } from "../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { HuespedRequest, HuespedResponse } from "../models/Huesped.model";
import { catchError, map, Observable, of, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HuespedesService {

   private apiUrl: string = enviroment.apiHuespedes;

  constructor(private http: HttpClient) { }

  getHuespedes(): Observable<HuespedResponse[]> {
    return this.http.get<HuespedResponse[]>(this.apiUrl).pipe(
      map(huespedes => huespedes.sort()),
      catchError(error => {
        console.error('Error al obtener los huespedes', error);
        return of([]);
      })
    );
  }

  postHuesped(huesped: HuespedRequest): Observable<HuespedResponse> {
    return this.http.post<HuespedResponse>(this.apiUrl, huesped).pipe(
      catchError(error => {
        console.error('Error al registrar el usuario', error);
        return throwError(() => error);
      })
    );
  }

  putHuesped(huesped: HuespedRequest, huespedId: string): Observable<HuespedResponse> {
    return this.http.put<HuespedResponse>(`${this.apiUrl}/${huespedId}`, huesped).pipe(
      catchError(error => {
        console.error('Error al actualizar el huesped', error);
        return throwError(() => error);
      })
    );
  }

  deleteHuesped(huespedId: string): Observable<HuespedResponse> {
    return this.http.delete<HuespedResponse>(`${this.apiUrl}/${huespedId}`).pipe(
      catchError(error => {
        console.error('Error al eliminar el huesped', error);
        return throwError(() => error);
      })
    );
  }

}