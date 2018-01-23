import { TablePage } from './table.po';

describe('GreyNoise Table', () => {
  let page: TablePage;

  beforeEach(() => {
    page = new TablePage();
  });

  it('should display data in table (greater than 2 to ensure data is loaded)', () => {
    page.navigateTo();
    expect(page.getTableElements().count()).toBeGreaterThan(2);
  });

   it('should display data and on click display the detail table', () => {
    page.navigateTo();
    page.getMainTableCell().click();
    expect(page.getDetailTableElements().count()).toBeGreaterThan(2);
  });

  it('should display modal on click (may not have any elements)', () => {
    page.navigateTo();
    page.getMainTableCell().click();
    page.getDetailTableCell().click();
    expect(page.getOpenDialogElement()).toBeTruthy();
  });

});