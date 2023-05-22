import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { CustomerDetailsPage } from './customer-details';
import { CustomerDetailsUpdatePage } from './customer-details-update';
import { CustomerDetails, CustomerDetailsService, CustomerDetailsDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class CustomerDetailsResolve implements Resolve<CustomerDetails> {
  constructor(private service: CustomerDetailsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CustomerDetails> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<CustomerDetails>) => response.ok),
        map((customerDetails: HttpResponse<CustomerDetails>) => customerDetails.body)
      );
    }
    return of(new CustomerDetails());
  }
}

const routes: Routes = [
  {
    path: '',
    component: CustomerDetailsPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CustomerDetailsUpdatePage,
    resolve: {
      data: CustomerDetailsResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CustomerDetailsDetailPage,
    resolve: {
      data: CustomerDetailsResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CustomerDetailsUpdatePage,
    resolve: {
      data: CustomerDetailsResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [CustomerDetailsPage, CustomerDetailsUpdatePage, CustomerDetailsDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class CustomerDetailsPageModule {}
