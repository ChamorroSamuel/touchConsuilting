import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product }    from '../models/product.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.base);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.base, product);
  }

  update(id: string, product: Product): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, product);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
