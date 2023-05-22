import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from '../../../services/utils/data-util.service';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage implements OnInit {
  product: Product = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.product = response.data;
    });
  }

  open(item: Product) {
    this.navController.navigateForward('/tabs/entities/product/' + item.id + '/edit');
  }

  async deleteModal(item: Product) {
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
            this.productService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/product');
            });
          },
        },
      ],
    });
    await alert.present();
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
}
