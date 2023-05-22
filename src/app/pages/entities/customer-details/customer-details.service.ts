import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { CustomerDetails } from './customer-details.model';

@Injectable({ providedIn: 'root' })
export class CustomerDetailsService {
  private resourceUrl = ApiService.API_URL + '/customer-details';

  constructor(protected http: HttpClient) {}

  create(customerDetails: CustomerDetails): Observable<HttpResponse<CustomerDetails>> {
    return this.http.post<CustomerDetails>(this.resourceUrl, customerDetails, { observe: 'response' });
  }

  update(customerDetails: CustomerDetails): Observable<HttpResponse<CustomerDetails>> {
    return this.http.put(`${this.resourceUrl}/${customerDetails.id}`, customerDetails, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<CustomerDetails>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<CustomerDetails[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomerDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
