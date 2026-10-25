import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocationResponse } from '../models/location.model';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private http = inject(HttpClient);
  private baseUrl = '/api/locations';

  getProvinces(): Observable<LocationResponse[]> {
    return this.http.get<LocationResponse[]>(`${this.baseUrl}/provinces`);
  }

  getCities(provinceId: number): Observable<LocationResponse[]> {
    return this.http.get<LocationResponse[]>(`${this.baseUrl}/provinces/${provinceId}/cities`);
  }
}
