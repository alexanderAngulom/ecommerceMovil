import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class ProductComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-product';
}

export class ProductUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-product-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setDescriptionInput(description: string) {
    this.setInputValue('description', description);
  }

  setPriceInput(price: string) {
    this.setInputValue('price', price);
  }

  setProductSizeInput(productSize: string) {
    this.select('productSize', productSize);
  }

  setImageInput(image: string) {
    this.setBlob('image', image);
  }
}

export class ProductDetailPage extends EntityDetailPage {
  pageSelector = 'page-product-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getDescriptionContent() {
    return cy.get('#description-content');
  }

  getPriceContent() {
    return cy.get('#price-content');
  }

  getProductSizeContent() {
    return cy.get('#productSize-content');
  }

  getImageContent() {
    return cy.get('#image-content');
  }
}
