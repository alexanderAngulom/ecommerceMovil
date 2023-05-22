import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ProductCategory } from './product-category.model';
import { ProductCategoryService } from './product-category.service';

@Component({
  selector: 'page-product-category',
  templateUrl: 'product-category.html',
})
export class ProductCategoryPage {
  productCategories: ProductCategory[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private productCategoryService: ProductCategoryService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.productCategories = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.productCategoryService
      .query()
      .pipe(
        filter((res: HttpResponse<ProductCategory[]>) => res.ok),
        map((res: HttpResponse<ProductCategory[]>) => res.body)
      )
      .subscribe(
        (response: ProductCategory[]) => {
          this.productCategories = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async error => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          await toast.present();
        }
      );
  }

  trackId(index: number, item: ProductCategory) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/product-category/new');
  }

  async edit(item: IonItemSliding, productCategory: ProductCategory) {
    await this.navController.navigateForward('/tabs/entities/product-category/' + productCategory.id + '/edit');
    await item.close();
  }

  async delete(productCategory) {
    this.productCategoryService.delete(productCategory.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ProductCategory deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(productCategory: ProductCategory) {
    await this.navController.navigateForward('/tabs/entities/product-category/' + productCategory.id + '/view');
  }
}
