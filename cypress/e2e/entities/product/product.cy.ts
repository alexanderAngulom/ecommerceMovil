import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { ProductComponentsPage, ProductDetailPage, ProductUpdatePage } from '../../../support/pages/entities/product/product.po';
import productSample from './product.json';

describe('Product entity', () => {
  const COMPONENT_TITLE = 'Products';
  const SUBCOMPONENT_TITLE = 'Product';

  const productPageUrl = '/tabs/entities/product';
  const productApiUrl = '/api/products';

  const productComponentsPage = new ProductComponentsPage();
  const productUpdatePage = new ProductUpdatePage();
  const productDetailPage = new ProductDetailPage();

  let product: any;

  beforeEach(() => {
    product = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Products page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      productComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', productPageUrl);

      productComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Product page and go back', () => {
      cy.visit(productPageUrl);
      productComponentsPage.clickOnCreateButton();

      productUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      productUpdatePage.back();
      cy.url().should('include', productPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: productApiUrl,
        body: productSample,
      }).then(({ body }) => {
        product = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${productApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [product],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (product) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${productApiUrl}/${product.id}`,
        }).then(() => {
          product = undefined;
        });
      }
    });

    it('should open Product view, open Product edit and go back', () => {
      cy.visit(productPageUrl);
      productComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (product.name !== undefined && product.name !== null) {
        productDetailPage.getNameContent().contains(product.name);
      }
      if (product.description !== undefined && product.description !== null) {
        productDetailPage.getDescriptionContent().contains(product.description);
      }
      if (product.price !== undefined && product.price !== null) {
        productDetailPage.getPriceContent().contains(product.price);
      }
      productDetailPage.edit();

      productUpdatePage.back();
      productDetailPage.back();
      cy.url().should('include', productPageUrl);
    });

    it('should open Product view, open Product edit and save', () => {
      cy.visit(productPageUrl);
      productComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      productDetailPage.edit();

      productUpdatePage.save();
      cy.url().should('include', productPageUrl);
    });

    it('should delete Product', () => {
      cy.visit(productPageUrl);
      productComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      productComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      product = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: productApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (product) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${productApiUrl}/${product.id}`,
        }).then(() => {
          product = undefined;
        });
      }
    });

    it('should create Product', () => {
      cy.visit(productPageUrl + '/new');

      productUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (productSample.name !== undefined && productSample.name !== null) {
        productUpdatePage.setNameInput(productSample.name);
      }
      if (productSample.description !== undefined && productSample.description !== null) {
        productUpdatePage.setDescriptionInput(productSample.description);
      }
      if (productSample.price !== undefined && productSample.price !== null) {
        productUpdatePage.setPriceInput(productSample.price);
      }
      if (productSample.productSize !== undefined && productSample.productSize !== null) {
        productUpdatePage.setProductSizeInput(productSample.productSize);
      }
      if (productSample.image !== undefined && productSample.image !== null) {
        productUpdatePage.setImageInput(productSample.image);
      }
      productUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        product = body;
      });

      productComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
