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

import { ShoppingCartPage } from './shopping-cart';
import { ShoppingCartUpdatePage } from './shopping-cart-update';
import { ShoppingCart, ShoppingCartService, ShoppingCartDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ShoppingCartResolve implements Resolve<ShoppingCart> {
  constructor(private service: ShoppingCartService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ShoppingCart> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ShoppingCart>) => response.ok),
        map((shoppingCart: HttpResponse<ShoppingCart>) => shoppingCart.body)
      );
    }
    return of(new ShoppingCart());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ShoppingCartPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShoppingCartUpdatePage,
    resolve: {
      data: ShoppingCartResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShoppingCartDetailPage,
    resolve: {
      data: ShoppingCartResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShoppingCartUpdatePage,
    resolve: {
      data: ShoppingCartResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ShoppingCartPage, ShoppingCartUpdatePage, ShoppingCartDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ShoppingCartPageModule {}
