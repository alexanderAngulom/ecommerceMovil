import { Component, OnInit } from '@angular/core';
import { ProductOrder } from './product-order.model';
import { ProductOrderService } from './product-order.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-product-order-detail',
  templateUrl: 'product-order-detail.html',
})
export class ProductOrderDetailPage implements OnInit {
  productOrder: ProductOrder = {};

  constructor(
    private navController: NavController,
    private productOrderService: ProductOrderService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.productOrder = response.data;
    });
  }

  open(item: ProductOrder) {
    this.navController.navigateForward('/tabs/entities/product-order/' + item.id + '/edit');
  }

  async deleteModal(item: ProductOrder) {
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
            this.productOrderService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/product-order');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
