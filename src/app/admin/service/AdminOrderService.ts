import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AdminOrder, OrderStatus} from "../dto/AdminOrder";
@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  private http = inject(HttpClient);
  private baseUrl = '/api/admin/orders';

  getAll(status?: OrderStatus): Observable<AdminOrder[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<AdminOrder[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<AdminOrder> {
    return this.http.get<AdminOrder>(`${this.baseUrl}/${id}`);
  }

  updateStatus(id: number, status: OrderStatus): Observable<AdminOrder> {
    return this.http.patch<AdminOrder>(`${this.baseUrl}/${id}/status`, { status });
  }
}
