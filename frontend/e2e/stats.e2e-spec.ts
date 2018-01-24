import { StatsPage } from './stats.po';

describe('GreyNoise Stats', () => {
  let page: StatsPage;

  beforeEach(() => {
    page = new StatsPage();
  });

 it('should display chart when select option', () => {
    page.navigateTo();
    page.getDropdown().click();

    page.getDropdownOption().click();

    expect(page.getLineChart()).toBeTruthy();
  });

});