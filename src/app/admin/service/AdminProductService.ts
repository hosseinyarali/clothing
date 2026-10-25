import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Product} from "../../models/product.model";

export interface VariantReq {
  size: string;
  color: string;
  stockQuantity: number;
  price?: number | null;
  sku?: string | null;
}

export interface ProductReq {
  name: string;
  description?: string | null;
  basePrice: number;
  categoryId: number;
  imageUrl?: string | null;
  variants: VariantReq[];
}

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private http = inject(HttpClient);
  private url = '/api/admin/products';

  create(req: ProductReq): Observable<any> {
    return this.http.post(this.url, req);
  }
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
