import { browser, by, element, protractor } from 'protractor';

export class TablePage {
  navigateTo() {
    return browser.get('/table');
  }

  getBlockUIElement() {
    return element(by.tagName('p-blockUI'));
  }
  getTableElements() {
    let EC = protractor.ExpectedConditions;
    browser.wait(EC.not(EC.visibilityOf(element(by.css('.ui-blockui .ui-widget-overlay .ui-blockui-document')))));
    browser.sleep(30000);
    return element.all(by.css('#mainTable tbody tr'));
  }

  getMainTableCell(){
  	return element.all(by.css('#mainTable tbody tr td a')).first();
  }

  getDetailTableElements() {
    return element.all(by.css('#secondaryTable tbody tr'));
  }

  getDetailTableCell(){
  	return element.all(by.css('#secondaryTable tbody tr')).first();
  }

  getOpenDialogElement() {
    return element(by.tagName('p-dialog'));
  }
};
