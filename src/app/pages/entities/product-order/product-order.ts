import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ProductOrder } from './product-order.model';
import { ProductOrderService } from './product-order.service';

@Component({
  selector: 'page-product-order',
  templateUrl: 'product-order.html',
})
export class ProductOrderPage {
  productOrders: ProductOrder[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private productOrderService: ProductOrderService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.productOrders = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.productOrderService
      .query()
      .pipe(
        filter((res: HttpResponse<ProductOrder[]>) => res.ok),
        map((res: HttpResponse<ProductOrder[]>) => res.body)
      )
      .subscribe(
        (response: ProductOrder[]) => {
          this.productOrders = response;
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

  trackId(index: number, item: ProductOrder) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/product-order/new');
  }

  async edit(item: IonItemSliding, productOrder: ProductOrder) {
    await this.navController.navigateForward('/tabs/entities/product-order/' + productOrder.id + '/edit');
    await item.close();
  }

  async delete(productOrder) {
    this.productOrderService.delete(productOrder.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ProductOrder deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(productOrder: ProductOrder) {
    await this.navController.navigateForward('/tabs/entities/product-order/' + productOrder.id + '/view');
  }
}
