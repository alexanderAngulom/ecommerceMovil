import { Component, OnInit } from '@angular/core';
import { ProductCategory } from './product-category.model';
import { ProductCategoryService } from './product-category.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-product-category-detail',
  templateUrl: 'product-category-detail.html',
})
export class ProductCategoryDetailPage implements OnInit {
  productCategory: ProductCategory = {};

  constructor(
    private navController: NavController,
    private productCategoryService: ProductCategoryService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.productCategory = response.data;
    });
  }

  open(item: ProductCategory) {
    this.navController.navigateForward('/tabs/entities/product-category/' + item.id + '/edit');
  }

  async deleteModal(item: ProductCategory) {
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
            this.productCategoryService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/product-category');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
