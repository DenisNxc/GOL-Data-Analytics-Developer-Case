import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface Booking {
  id: number;
  first_name: string;
  last_name: string;
  birthday: string;
  document: string;
  departure_date: string;
  departure_iata: string;
  arrival_iata: string;
  arrival_date: string;
  created_at: string;
  updated_at: string;
}

export interface BookingsResponse {
  count: number;
  limit: number;
  data: Booking[];
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private baseUrl = `${environment.apiUrl}/api/v1/booking`;

  constructor(private http: HttpClient) {}

  getAll(limit: number = 5000): Observable<BookingsResponse> {
    let params = new HttpParams();
    if (limit) {
      params = params.set('limit', limit.toString());
    }

    return this.http.get<BookingsResponse>(this.baseUrl, { params });
  }

  create(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.baseUrl, booking);
  }

  download(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/file/download`, {
      responseType: 'blob',
      headers: {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  }

  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('content', file);

    return this.http.post(`${this.baseUrl}/file/upload`, formData, {
      headers: {
        Accept: 'application/json',
      },
      reportProgress: true,
      observe: 'response',
    });
  }
}
