import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entities',
  templateUrl: 'entities.page.html',
  styleUrls: ['entities.page.scss'],
})
export class EntitiesPage {
  entities: Array<any> = [
    { name: 'Product', component: 'ProductPage', route: 'product' },
    { name: 'Product Category', component: 'ProductCategoryPage', route: 'product-category' },
    { name: 'Customer Details', component: 'CustomerDetailsPage', route: 'customer-details' },
    { name: 'Shopping Cart', component: 'ShoppingCartPage', route: 'shopping-cart' },
    { name: 'Product Order', component: 'ProductOrderPage', route: 'product-order' },
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) {}

  openPage(page) {
    this.navController.navigateForward('/tabs/entities/' + page.route);
  }
}
