import { browser, by, element, protractor } from 'protractor';

export class TablePage {
  navigateTo() {
    return browser.get('/table');
  }

  getTableElements() {
    let EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.css('#mainTable tbody tr td a'))));
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
    return element(by.css('#dialogTable'));
  }
};
