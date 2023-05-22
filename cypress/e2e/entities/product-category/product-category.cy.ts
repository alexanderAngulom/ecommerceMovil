import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  ProductCategoryComponentsPage,
  ProductCategoryDetailPage,
  ProductCategoryUpdatePage,
} from '../../../support/pages/entities/product-category/product-category.po';
import productCategorySample from './product-category.json';

describe('ProductCategory entity', () => {
  const COMPONENT_TITLE = 'Product Categories';
  const SUBCOMPONENT_TITLE = 'Product Category';

  const productCategoryPageUrl = '/tabs/entities/product-category';
  const productCategoryApiUrl = '/api/product-categories';

  const productCategoryComponentsPage = new ProductCategoryComponentsPage();
  const productCategoryUpdatePage = new ProductCategoryUpdatePage();
  const productCategoryDetailPage = new ProductCategoryDetailPage();

  let productCategory: any;

  beforeEach(() => {
    productCategory = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load ProductCategories page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      productCategoryComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', productCategoryPageUrl);

      productCategoryComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create ProductCategory page and go back', () => {
      cy.visit(productCategoryPageUrl);
      productCategoryComponentsPage.clickOnCreateButton();

      productCategoryUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      productCategoryUpdatePage.back();
      cy.url().should('include', productCategoryPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: productCategoryApiUrl,
        body: productCategorySample,
      }).then(({ body }) => {
        productCategory = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${productCategoryApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [productCategory],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (productCategory) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${productCategoryApiUrl}/${productCategory.id}`,
        }).then(() => {
          productCategory = undefined;
        });
      }
    });

    it('should open ProductCategory view, open ProductCategory edit and go back', () => {
      cy.visit(productCategoryPageUrl);
      productCategoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productCategoryDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (productCategory.name !== undefined && productCategory.name !== null) {
        productCategoryDetailPage.getNameContent().contains(productCategory.name);
      }
      if (productCategory.description !== undefined && productCategory.description !== null) {
        productCategoryDetailPage.getDescriptionContent().contains(productCategory.description);
      }
      productCategoryDetailPage.edit();

      productCategoryUpdatePage.back();
      productCategoryDetailPage.back();
      cy.url().should('include', productCategoryPageUrl);
    });

    it('should open ProductCategory view, open ProductCategory edit and save', () => {
      cy.visit(productCategoryPageUrl);
      productCategoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productCategoryDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      productCategoryDetailPage.edit();

      productCategoryUpdatePage.save();
      cy.url().should('include', productCategoryPageUrl);
    });

    it('should delete ProductCategory', () => {
      cy.visit(productCategoryPageUrl);
      productCategoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productCategoryDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      productCategoryComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      productCategory = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: productCategoryApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (productCategory) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${productCategoryApiUrl}/${productCategory.id}`,
        }).then(() => {
          productCategory = undefined;
        });
      }
    });

    it('should create ProductCategory', () => {
      cy.visit(productCategoryPageUrl + '/new');

      productCategoryUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (productCategorySample.name !== undefined && productCategorySample.name !== null) {
        productCategoryUpdatePage.setNameInput(productCategorySample.name);
      }
      if (productCategorySample.description !== undefined && productCategorySample.description !== null) {
        productCategoryUpdatePage.setDescriptionInput(productCategorySample.description);
      }
      productCategoryUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        productCategory = body;
      });

      productCategoryComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
