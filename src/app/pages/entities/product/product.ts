import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from '../../../services/utils/data-util.service';
import { Product } from './product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  products: Product[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private productService: ProductService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.products = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.productService
      .query()
      .pipe(
        filter((res: HttpResponse<Product[]>) => res.ok),
        map((res: HttpResponse<Product[]>) => res.body)
      )
      .subscribe(
        (response: Product[]) => {
          this.products = response;
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

  trackId(index: number, item: Product) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/product/new');
  }

  async edit(item: IonItemSliding, product: Product) {
    await this.navController.navigateForward('/tabs/entities/product/' + product.id + '/edit');
    await item.close();
  }

  async delete(product) {
    this.productService.delete(product.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Product deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(product: Product) {
    await this.navController.navigateForward('/tabs/entities/product/' + product.id + '/view');
  }
}
