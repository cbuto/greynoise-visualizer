import { browser, by, element } from 'protractor';

export class TablePage {
  navigateTo() {
    return browser.get('/table');
  }

  getTableElements() {
    return element.all(by.css('#mainTable tr.ui-widget-content'));
  }

  getMainTableCell(){
  	return element.all(by.css('#mainTable .ui-datatable-even .ui-cell-data')).first();
  }

  getDetailTableElements() {
    return element.all(by.css('#secondaryTable tr.ui-widget-content'));
  }

  getDetailTableCell(){
  	return element.all(by.css('#secondaryTable .ui-datatable-even .ui-cell-data')).first();
  }

  getOpenDialogElement() {
    return element(by.tagName('p-dialog'));
  }
};
