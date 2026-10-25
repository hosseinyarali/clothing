import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateOrderRequest,
  OrderResponse,
  OrderStatus,
} from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = '/api/orders';

  // ===== ثبت سفارش =====
  create(req: CreateOrderRequest, customerId: number): Observable<OrderResponse> {
    const params = new HttpParams().set('customerId', customerId);
    return this.http.post<OrderResponse>(this.baseUrl, req, { params });
  }

  // ===== سفارش‌های من =====
  getMyOrders(customerId: number): Observable<OrderResponse[]> {
    const params = new HttpParams().set('customerId', customerId);
    return this.http.get<OrderResponse[]>(`${this.baseUrl}/my`, { params });
  }

  // ===== جزئیات سفارش =====
  getById(id: number, customerId: number): Observable<OrderResponse> {
    const params = new HttpParams().set('customerId', customerId);
    return this.http.get<OrderResponse>(`${this.baseUrl}/${id}`, { params });
  }

  // ===== لغو سفارش =====
  cancel(id: number, customerId: number): Observable<OrderResponse> {
    const params = new HttpParams().set('customerId', customerId);
    return this.http.post<OrderResponse>(`${this.baseUrl}/${id}/cancel`, {}, { params });
  }

  // ===== ادمین: همه سفارش‌ها =====
  getAll(status?: OrderStatus): Observable<OrderResponse[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<OrderResponse[]>(this.baseUrl, { params });
  }

  // ===== ادمین: تغییر وضعیت =====
  updateStatus(id: number, status: OrderStatus): Observable<OrderResponse> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<OrderResponse>(`${this.baseUrl}/${id}/status`, {}, { params });
  }
}
