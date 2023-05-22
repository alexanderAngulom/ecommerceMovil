import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class ProductCategoryComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-product-category';
}

export class ProductCategoryUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-product-category-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setDescriptionInput(description: string) {
    this.setInputValue('description', description);
  }
}

export class ProductCategoryDetailPage extends EntityDetailPage {
  pageSelector = 'page-product-category-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getDescriptionContent() {
    return cy.get('#description-content');
  }
}
