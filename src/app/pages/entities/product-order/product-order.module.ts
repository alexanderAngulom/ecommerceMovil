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

import { ProductOrderPage } from './product-order';
import { ProductOrderUpdatePage } from './product-order-update';
import { ProductOrder, ProductOrderService, ProductOrderDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ProductOrderResolve implements Resolve<ProductOrder> {
  constructor(private service: ProductOrderService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductOrder> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ProductOrder>) => response.ok),
        map((productOrder: HttpResponse<ProductOrder>) => productOrder.body)
      );
    }
    return of(new ProductOrder());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ProductOrderPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductOrderUpdatePage,
    resolve: {
      data: ProductOrderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductOrderDetailPage,
    resolve: {
      data: ProductOrderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductOrderUpdatePage,
    resolve: {
      data: ProductOrderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ProductOrderPage, ProductOrderUpdatePage, ProductOrderDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ProductOrderPageModule {}
