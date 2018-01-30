import { browser, by, element, ExpectedConditions } from 'protractor';

export class IPSearchPage {
  navigateTo() {
    return browser.get('/ip');
  }

  navigateToLink() {
    return browser.get('/ip/66.111.57.56');
  }

  getTableElements() {
    return element.all(by.css('#ipTable tbody tr'));
  }

  getInputBox(){
    return element(by.css('#ipsearchbox'));
  }

  getSearchButton(){
    return element(by.css('#submitButton'));
  }

  getMapMarkers(){
    browser.sleep(2000);
    return element.all(by.css('.leaflet-marker-icon'));
  }

   getErrorMessage(){
    return element(by.css('.ui-messages-error'));
  }
};