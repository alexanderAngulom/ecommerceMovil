import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  ProductOrderComponentsPage,
  ProductOrderDetailPage,
  ProductOrderUpdatePage,
} from '../../../support/pages/entities/product-order/product-order.po';
import productOrderSample from './product-order.json';

describe('ProductOrder entity', () => {
  const COMPONENT_TITLE = 'Product Orders';
  const SUBCOMPONENT_TITLE = 'Product Order';

  const productOrderPageUrl = '/tabs/entities/product-order';
  const productOrderApiUrl = '/api/product-orders';

  const productOrderComponentsPage = new ProductOrderComponentsPage();
  const productOrderUpdatePage = new ProductOrderUpdatePage();
  const productOrderDetailPage = new ProductOrderDetailPage();

  let productOrder: any;

  beforeEach(() => {
    productOrder = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load ProductOrders page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      productOrderComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', productOrderPageUrl);

      productOrderComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create ProductOrder page and go back', () => {
      cy.visit(productOrderPageUrl);
      productOrderComponentsPage.clickOnCreateButton();

      productOrderUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      productOrderUpdatePage.back();
      cy.url().should('include', productOrderPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: productOrderApiUrl,
        body: productOrderSample,
      }).then(({ body }) => {
        productOrder = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${productOrderApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [productOrder],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (productOrder) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${productOrderApiUrl}/${productOrder.id}`,
        }).then(() => {
          productOrder = undefined;
        });
      }
    });

    it('should open ProductOrder view, open ProductOrder edit and go back', () => {
      cy.visit(productOrderPageUrl);
      productOrderComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productOrderDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (productOrder.quantity !== undefined && productOrder.quantity !== null) {
        productOrderDetailPage.getQuantityContent().contains(productOrder.quantity);
      }
      if (productOrder.totalPrice !== undefined && productOrder.totalPrice !== null) {
        productOrderDetailPage.getTotalPriceContent().contains(productOrder.totalPrice);
      }
      productOrderDetailPage.edit();

      productOrderUpdatePage.back();
      productOrderDetailPage.back();
      cy.url().should('include', productOrderPageUrl);
    });

    it('should open ProductOrder view, open ProductOrder edit and save', () => {
      cy.visit(productOrderPageUrl);
      productOrderComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productOrderDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      productOrderDetailPage.edit();

      productOrderUpdatePage.save();
      cy.url().should('include', productOrderPageUrl);
    });

    it('should delete ProductOrder', () => {
      cy.visit(productOrderPageUrl);
      productOrderComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productOrderDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      productOrderComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      productOrder = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: productOrderApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (productOrder) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${productOrderApiUrl}/${productOrder.id}`,
        }).then(() => {
          productOrder = undefined;
        });
      }
    });

    it('should create ProductOrder', () => {
      cy.visit(productOrderPageUrl + '/new');

      productOrderUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (productOrderSample.quantity !== undefined && productOrderSample.quantity !== null) {
        productOrderUpdatePage.setQuantityInput(productOrderSample.quantity);
      }
      if (productOrderSample.totalPrice !== undefined && productOrderSample.totalPrice !== null) {
        productOrderUpdatePage.setTotalPriceInput(productOrderSample.totalPrice);
      }
      productOrderUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        productOrder = body;
      });

      productOrderComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
