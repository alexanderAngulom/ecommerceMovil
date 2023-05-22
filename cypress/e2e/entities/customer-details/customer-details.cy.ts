import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  CustomerDetailsComponentsPage,
  CustomerDetailsDetailPage,
  CustomerDetailsUpdatePage,
} from '../../../support/pages/entities/customer-details/customer-details.po';
import customerDetailsSample from './customer-details.json';

describe('CustomerDetails entity', () => {
  const COMPONENT_TITLE = 'Customer Details';
  const SUBCOMPONENT_TITLE = 'Customer Details';

  const customerDetailsPageUrl = '/tabs/entities/customer-details';
  const customerDetailsApiUrl = '/api/customer-details';

  const customerDetailsComponentsPage = new CustomerDetailsComponentsPage();
  const customerDetailsUpdatePage = new CustomerDetailsUpdatePage();
  const customerDetailsDetailPage = new CustomerDetailsDetailPage();

  let customerDetails: any;

  beforeEach(() => {
    customerDetails = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load CustomerDetails page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      customerDetailsComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', customerDetailsPageUrl);

      customerDetailsComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create CustomerDetails page and go back', () => {
      cy.visit(customerDetailsPageUrl);
      customerDetailsComponentsPage.clickOnCreateButton();

      customerDetailsUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      customerDetailsUpdatePage.back();
      cy.url().should('include', customerDetailsPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: customerDetailsApiUrl,
        body: customerDetailsSample,
      }).then(({ body }) => {
        customerDetails = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${customerDetailsApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [customerDetails],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (customerDetails) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${customerDetailsApiUrl}/${customerDetails.id}`,
        }).then(() => {
          customerDetails = undefined;
        });
      }
    });

    it('should open CustomerDetails view, open CustomerDetails edit and go back', () => {
      cy.visit(customerDetailsPageUrl);
      customerDetailsComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      customerDetailsDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (customerDetails.phone !== undefined && customerDetails.phone !== null) {
        customerDetailsDetailPage.getPhoneContent().contains(customerDetails.phone);
      }
      if (customerDetails.addressLine1 !== undefined && customerDetails.addressLine1 !== null) {
        customerDetailsDetailPage.getAddressLine1Content().contains(customerDetails.addressLine1);
      }
      if (customerDetails.addressLine2 !== undefined && customerDetails.addressLine2 !== null) {
        customerDetailsDetailPage.getAddressLine2Content().contains(customerDetails.addressLine2);
      }
      if (customerDetails.city !== undefined && customerDetails.city !== null) {
        customerDetailsDetailPage.getCityContent().contains(customerDetails.city);
      }
      if (customerDetails.country !== undefined && customerDetails.country !== null) {
        customerDetailsDetailPage.getCountryContent().contains(customerDetails.country);
      }
      customerDetailsDetailPage.edit();

      customerDetailsUpdatePage.back();
      customerDetailsDetailPage.back();
      cy.url().should('include', customerDetailsPageUrl);
    });

    it('should open CustomerDetails view, open CustomerDetails edit and save', () => {
      cy.visit(customerDetailsPageUrl);
      customerDetailsComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      customerDetailsDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      customerDetailsDetailPage.edit();

      customerDetailsUpdatePage.save();
      cy.url().should('include', customerDetailsPageUrl);
    });

    it('should delete CustomerDetails', () => {
      cy.visit(customerDetailsPageUrl);
      customerDetailsComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      customerDetailsDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      customerDetailsComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      customerDetails = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: customerDetailsApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (customerDetails) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${customerDetailsApiUrl}/${customerDetails.id}`,
        }).then(() => {
          customerDetails = undefined;
        });
      }
    });

    it('should create CustomerDetails', () => {
      cy.visit(customerDetailsPageUrl + '/new');

      customerDetailsUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (customerDetailsSample.gender !== undefined && customerDetailsSample.gender !== null) {
        customerDetailsUpdatePage.setGenderInput(customerDetailsSample.gender);
      }
      if (customerDetailsSample.phone !== undefined && customerDetailsSample.phone !== null) {
        customerDetailsUpdatePage.setPhoneInput(customerDetailsSample.phone);
      }
      if (customerDetailsSample.addressLine1 !== undefined && customerDetailsSample.addressLine1 !== null) {
        customerDetailsUpdatePage.setAddressLine1Input(customerDetailsSample.addressLine1);
      }
      if (customerDetailsSample.addressLine2 !== undefined && customerDetailsSample.addressLine2 !== null) {
        customerDetailsUpdatePage.setAddressLine2Input(customerDetailsSample.addressLine2);
      }
      if (customerDetailsSample.city !== undefined && customerDetailsSample.city !== null) {
        customerDetailsUpdatePage.setCityInput(customerDetailsSample.city);
      }
      if (customerDetailsSample.country !== undefined && customerDetailsSample.country !== null) {
        customerDetailsUpdatePage.setCountryInput(customerDetailsSample.country);
      }
      customerDetailsUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        customerDetails = body;
      });

      customerDetailsComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
