import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ShoppingCart } from './shopping-cart.model';
import { ShoppingCartService } from './shopping-cart.service';

@Component({
  selector: 'page-shopping-cart',
  templateUrl: 'shopping-cart.html',
})
export class ShoppingCartPage {
  shoppingCarts: ShoppingCart[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private shoppingCartService: ShoppingCartService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.shoppingCarts = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.shoppingCartService
      .query()
      .pipe(
        filter((res: HttpResponse<ShoppingCart[]>) => res.ok),
        map((res: HttpResponse<ShoppingCart[]>) => res.body)
      )
      .subscribe(
        (response: ShoppingCart[]) => {
          this.shoppingCarts = response;
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

  trackId(index: number, item: ShoppingCart) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/shopping-cart/new');
  }

  async edit(item: IonItemSliding, shoppingCart: ShoppingCart) {
    await this.navController.navigateForward('/tabs/entities/shopping-cart/' + shoppingCart.id + '/edit');
    await item.close();
  }

  async delete(shoppingCart) {
    this.shoppingCartService.delete(shoppingCart.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ShoppingCart deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(shoppingCart: ShoppingCart) {
    await this.navController.navigateForward('/tabs/entities/shopping-cart/' + shoppingCart.id + '/view');
  }
}
