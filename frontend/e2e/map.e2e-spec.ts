import { MapPage } from './map.po';

describe('GreyNoise Map', () => {
  let page: MapPage;

  beforeEach(() => {
    page = new MapPage();
  });

  it('should display data in Map when select option', () => {
    page.navigateTo();
    page.getDropdown().click();

    page.getDropdownOption().click();

    expect(page.getMapMarkers()).toBeTruthy();
  });

});