import { IPSearchPage } from './ip-search.po';

describe('GreyNoise IP Search', () => {
  let page: IPSearchPage;

  beforeEach(() => {
    page = new IPSearchPage();
  });

  it('should display data in table and map on search', () => {
    page.navigateTo();

    page.getInputBox().sendKeys("66.111.57.56");

    page.getSearchButton().click();

    expect(page.getTableElements()).toBeTruthy();
    expect(page.getMapMarkers()).toBeTruthy();
  });

  it('should display error on search for non-existent IP', () => {
    page.navigateTo();

    page.getInputBox().sendKeys("192.168.1.1");

    page.getSearchButton().click();

    expect(page.getErrorMessage()).toBeTruthy();
  });

  it('should display data in table and map from link', () => {
    page.navigateToLink();

    expect(page.getTableElements()).toBeTruthy();
    expect(page.getMapMarkers()).toBeTruthy();
  });

});