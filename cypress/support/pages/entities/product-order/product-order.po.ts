import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class ProductOrderComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-product-order';
}

export class ProductOrderUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-product-order-update';

  setQuantityInput(quantity: string) {
    this.setInputValue('quantity', quantity);
  }

  setTotalPriceInput(totalPrice: string) {
    this.setInputValue('totalPrice', totalPrice);
  }
}

export class ProductOrderDetailPage extends EntityDetailPage {
  pageSelector = 'page-product-order-detail';

  getQuantityContent() {
    return cy.get('#quantity-content');
  }

  getTotalPriceContent() {
    return cy.get('#totalPrice-content');
  }
}
