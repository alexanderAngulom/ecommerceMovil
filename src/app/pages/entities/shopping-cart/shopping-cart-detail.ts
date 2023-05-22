import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from './shopping-cart.model';
import { ShoppingCartService } from './shopping-cart.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-shopping-cart-detail',
  templateUrl: 'shopping-cart-detail.html',
})
export class ShoppingCartDetailPage implements OnInit {
  shoppingCart: ShoppingCart = {};

  constructor(
    private navController: NavController,
    private shoppingCartService: ShoppingCartService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.shoppingCart = response.data;
    });
  }

  open(item: ShoppingCart) {
    this.navController.navigateForward('/tabs/entities/shopping-cart/' + item.id + '/edit');
  }

  async deleteModal(item: ShoppingCart) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.shoppingCartService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/shopping-cart');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
