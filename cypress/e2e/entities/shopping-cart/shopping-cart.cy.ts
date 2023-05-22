import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  ShoppingCartComponentsPage,
  ShoppingCartDetailPage,
  ShoppingCartUpdatePage,
} from '../../../support/pages/entities/shopping-cart/shopping-cart.po';
import shoppingCartSample from './shopping-cart.json';

describe('ShoppingCart entity', () => {
  const COMPONENT_TITLE = 'Shopping Carts';
  const SUBCOMPONENT_TITLE = 'Shopping Cart';

  const shoppingCartPageUrl = '/tabs/entities/shopping-cart';
  const shoppingCartApiUrl = '/api/shopping-carts';

  const shoppingCartComponentsPage = new ShoppingCartComponentsPage();
  const shoppingCartUpdatePage = new ShoppingCartUpdatePage();
  const shoppingCartDetailPage = new ShoppingCartDetailPage();

  let shoppingCart: any;

  beforeEach(() => {
    shoppingCart = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load ShoppingCarts page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      shoppingCartComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', shoppingCartPageUrl);

      shoppingCartComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create ShoppingCart page and go back', () => {
      cy.visit(shoppingCartPageUrl);
      shoppingCartComponentsPage.clickOnCreateButton();

      shoppingCartUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      shoppingCartUpdatePage.back();
      cy.url().should('include', shoppingCartPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: shoppingCartApiUrl,
        body: shoppingCartSample,
      }).then(({ body }) => {
        shoppingCart = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${shoppingCartApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [shoppingCart],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (shoppingCart) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${shoppingCartApiUrl}/${shoppingCart.id}`,
        }).then(() => {
          shoppingCart = undefined;
        });
      }
    });

    it('should open ShoppingCart view, open ShoppingCart edit and go back', () => {
      cy.visit(shoppingCartPageUrl);
      shoppingCartComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      shoppingCartDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (shoppingCart.totalPrice !== undefined && shoppingCart.totalPrice !== null) {
        shoppingCartDetailPage.getTotalPriceContent().contains(shoppingCart.totalPrice);
      }
      if (shoppingCart.paymentReference !== undefined && shoppingCart.paymentReference !== null) {
        shoppingCartDetailPage.getPaymentReferenceContent().contains(shoppingCart.paymentReference);
      }
      shoppingCartDetailPage.edit();

      shoppingCartUpdatePage.back();
      shoppingCartDetailPage.back();
      cy.url().should('include', shoppingCartPageUrl);
    });

    it('should open ShoppingCart view, open ShoppingCart edit and save', () => {
      cy.visit(shoppingCartPageUrl);
      shoppingCartComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      shoppingCartDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      shoppingCartDetailPage.edit();

      shoppingCartUpdatePage.save();
      cy.url().should('include', shoppingCartPageUrl);
    });

    it('should delete ShoppingCart', () => {
      cy.visit(shoppingCartPageUrl);
      shoppingCartComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      shoppingCartDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      shoppingCartComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      shoppingCart = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: shoppingCartApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (shoppingCart) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${shoppingCartApiUrl}/${shoppingCart.id}`,
        }).then(() => {
          shoppingCart = undefined;
        });
      }
    });

    it('should create ShoppingCart', () => {
      cy.visit(shoppingCartPageUrl + '/new');

      shoppingCartUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (shoppingCartSample.placedDate !== undefined && shoppingCartSample.placedDate !== null) {
        shoppingCartUpdatePage.setPlacedDateInput(shoppingCartSample.placedDate);
      }
      if (shoppingCartSample.status !== undefined && shoppingCartSample.status !== null) {
        shoppingCartUpdatePage.setStatusInput(shoppingCartSample.status);
      }
      if (shoppingCartSample.totalPrice !== undefined && shoppingCartSample.totalPrice !== null) {
        shoppingCartUpdatePage.setTotalPriceInput(shoppingCartSample.totalPrice);
      }
      if (shoppingCartSample.paymentMethod !== undefined && shoppingCartSample.paymentMethod !== null) {
        shoppingCartUpdatePage.setPaymentMethodInput(shoppingCartSample.paymentMethod);
      }
      if (shoppingCartSample.paymentReference !== undefined && shoppingCartSample.paymentReference !== null) {
        shoppingCartUpdatePage.setPaymentReferenceInput(shoppingCartSample.paymentReference);
      }
      shoppingCartUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        shoppingCart = body;
      });

      shoppingCartComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
