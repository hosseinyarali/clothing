import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CategoryRequest} from "../../models/category.model";
import {AdminCategory} from "../dto/AdminCategory";

@Injectable({ providedIn: 'root' })
export class AdminCategoryService {
  private http = inject(HttpClient);
  private baseUrl = '/api/categories';

  getAll(): Observable<AdminCategory[]> {
    return this.http.get<AdminCategory[]>(this.baseUrl);
  }

  create(req: CategoryRequest): Observable<AdminCategory> {
    return this.http.post<AdminCategory>(this.baseUrl, req);
  }

  update(id: number, req: CategoryRequest): Observable<AdminCategory> {
    return this.http.put<AdminCategory>(`${this.baseUrl}/${id}`, req);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
