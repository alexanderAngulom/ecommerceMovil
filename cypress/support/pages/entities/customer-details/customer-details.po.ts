import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class CustomerDetailsComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-customer-details';
}

export class CustomerDetailsUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-customer-details-update';

  setGenderInput(gender: string) {
    this.select('gender', gender);
  }

  setPhoneInput(phone: string) {
    this.setInputValue('phone', phone);
  }

  setAddressLine1Input(addressLine1: string) {
    this.setInputValue('addressLine1', addressLine1);
  }

  setAddressLine2Input(addressLine2: string) {
    this.setInputValue('addressLine2', addressLine2);
  }

  setCityInput(city: string) {
    this.setInputValue('city', city);
  }

  setCountryInput(country: string) {
    this.setInputValue('country', country);
  }
}

export class CustomerDetailsDetailPage extends EntityDetailPage {
  pageSelector = 'page-customer-details-detail';

  getGenderContent() {
    return cy.get('#gender-content');
  }

  getPhoneContent() {
    return cy.get('#phone-content');
  }

  getAddressLine1Content() {
    return cy.get('#addressLine1-content');
  }

  getAddressLine2Content() {
    return cy.get('#addressLine2-content');
  }

  getCityContent() {
    return cy.get('#city-content');
  }

  getCountryContent() {
    return cy.get('#country-content');
  }
}
