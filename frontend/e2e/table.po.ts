import { browser, by, element } from 'protractor';

export class TablePage {
  navigateTo() {
    return browser.get('/table');
  }

  getTableElements() {
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
