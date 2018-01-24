import { browser, by, element } from 'protractor';

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
    return element(by.tagName('p-chart'));
  }
};