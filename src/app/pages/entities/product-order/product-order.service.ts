import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { ProductOrder } from './product-order.model';

@Injectable({ providedIn: 'root' })
export class ProductOrderService {
  private resourceUrl = ApiService.API_URL + '/product-orders';

  constructor(protected http: HttpClient) {}

  create(productOrder: ProductOrder): Observable<HttpResponse<ProductOrder>> {
    return this.http.post<ProductOrder>(this.resourceUrl, productOrder, { observe: 'response' });
  }

  update(productOrder: ProductOrder): Observable<HttpResponse<ProductOrder>> {
    return this.http.put(`${this.resourceUrl}/${productOrder.id}`, productOrder, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ProductOrder>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ProductOrder[]>> {
    const options = createRequestOption(req);
    return this.http.get<ProductOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: String): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
