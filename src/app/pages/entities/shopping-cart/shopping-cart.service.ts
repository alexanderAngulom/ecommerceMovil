import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { ShoppingCart } from './shopping-cart.model';

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  private resourceUrl = ApiService.API_URL + '/shopping-carts';

  constructor(protected http: HttpClient) {}

  create(shoppingCart: ShoppingCart): Observable<HttpResponse<ShoppingCart>> {
    return this.http.post<ShoppingCart>(this.resourceUrl, shoppingCart, { observe: 'response' });
  }

  update(shoppingCart: ShoppingCart): Observable<HttpResponse<ShoppingCart>> {
    return this.http.put(`${this.resourceUrl}/${shoppingCart.id}`, shoppingCart, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ShoppingCart>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ShoppingCart[]>> {
    const options = createRequestOption(req);
    return this.http.get<ShoppingCart[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
