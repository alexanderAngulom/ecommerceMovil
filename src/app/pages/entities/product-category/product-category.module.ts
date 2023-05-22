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

import { ProductCategoryPage } from './product-category';
import { ProductCategoryUpdatePage } from './product-category-update';
import { ProductCategory, ProductCategoryService, ProductCategoryDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ProductCategoryResolve implements Resolve<ProductCategory> {
  constructor(private service: ProductCategoryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductCategory> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ProductCategory>) => response.ok),
        map((productCategory: HttpResponse<ProductCategory>) => productCategory.body)
      );
    }
    return of(new ProductCategory());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ProductCategoryPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductCategoryUpdatePage,
    resolve: {
      data: ProductCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductCategoryDetailPage,
    resolve: {
      data: ProductCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductCategoryUpdatePage,
    resolve: {
      data: ProductCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ProductCategoryPage, ProductCategoryUpdatePage, ProductCategoryDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ProductCategoryPageModule {}
