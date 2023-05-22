import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private resourceUrl = ApiService.API_URL + '/products';

  constructor(protected http: HttpClient) {}

  create(product: Product): Observable<HttpResponse<Product>> {
    return this.http.post<Product>(this.resourceUrl, product, { observe: 'response' });
  }

  update(product: Product): Observable<HttpResponse<Product>> {
    return this.http.put(`${this.resourceUrl}/${product.id}`, product, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Product>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Product[]>> {
    const options = createRequestOption(req);
    return this.http.get<Product[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
