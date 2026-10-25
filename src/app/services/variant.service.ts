import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Variant, VariantRequest } from '../models/variant.model';

@Injectable({ providedIn: 'root' })
export class VariantService {
  private http = inject(HttpClient);
  private baseUrl = '/api';

  getByProduct(productId: number): Observable<Variant[]> {
    return this.http.get<Variant[]>(`${this.baseUrl}/products/${productId}/variants`);
  }

  create(productId: number, req: VariantRequest): Observable<Variant> {
    return this.http.post<Variant>(`${this.baseUrl}/products/${productId}/variants`, req);
  }

  updateStock(variantId: number, stock: number): Observable<Variant> {
    const params = new HttpParams().set('stock', stock);
    return this.http.patch<Variant>(`${this.baseUrl}/variants/${variantId}/stock`, null, { params });
  }

  delete(variantId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/variants/${variantId}`);
  }
}
