import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class ShoppingCartComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-shopping-cart';
}

export class ShoppingCartUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-shopping-cart-update';

  setPlacedDateInput(placedDate: string) {
    this.setDateTime('placedDate', placedDate);
  }

  setStatusInput(status: string) {
    this.select('status', status);
  }

  setTotalPriceInput(totalPrice: string) {
    this.setInputValue('totalPrice', totalPrice);
  }

  setPaymentMethodInput(paymentMethod: string) {
    this.select('paymentMethod', paymentMethod);
  }

  setPaymentReferenceInput(paymentReference: string) {
    this.setInputValue('paymentReference', paymentReference);
  }
}

export class ShoppingCartDetailPage extends EntityDetailPage {
  pageSelector = 'page-shopping-cart-detail';

  getPlacedDateContent() {
    return cy.get('#placedDate-content');
  }

  getStatusContent() {
    return cy.get('#status-content');
  }

  getTotalPriceContent() {
    return cy.get('#totalPrice-content');
  }

  getPaymentMethodContent() {
    return cy.get('#paymentMethod-content');
  }

  getPaymentReferenceContent() {
    return cy.get('#paymentReference-content');
  }
}
