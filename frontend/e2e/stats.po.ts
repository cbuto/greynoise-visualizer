import { browser, by, element, ExpectedConditions } from 'protractor';

export class StatsPage {
  navigateTo() {
    return browser.get('/stats');
  }

  getDropdown() {
    return element(by.css('#time-series-drop'));
  }

  getDropdownOption() {
    return element.all(by.css('#time-series-drop ul li')).first();
  }

  getLineChart(){
    let EC = ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.tagName('p-chart'))));
    return element(by.tagName('p-chart'));
  }
};