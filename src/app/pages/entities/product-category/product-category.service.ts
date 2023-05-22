import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { ProductCategory } from './product-category.model';

@Injectable({ providedIn: 'root' })
export class ProductCategoryService {
  private resourceUrl = ApiService.API_URL + '/product-categories';

  constructor(protected http: HttpClient) {}

  create(productCategory: ProductCategory): Observable<HttpResponse<ProductCategory>> {
    return this.http.post<ProductCategory>(this.resourceUrl, productCategory, { observe: 'response' });
  }

  update(productCategory: ProductCategory): Observable<HttpResponse<ProductCategory>> {
    return this.http.put(`${this.resourceUrl}/${productCategory.id}`, productCategory, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ProductCategory>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ProductCategory[]>> {
    const options = createRequestOption(req);
    return this.http.get<ProductCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
