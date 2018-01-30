import { browser, by, element} from 'protractor';

export class MapPage {
  navigateTo() {
    return browser.get('/map');
  }

  getDropdown() {
    return element(by.css('#map-drop'));
  }

  getDropdownOption() {
    return element.all(by.css('#map-drop ul li')).first();
  }

  getMapMarkers(){
    browser.sleep(2000);
    return element.all(by.css('.leaflet-marker-icon .marker-cluster')).first();
  }
};