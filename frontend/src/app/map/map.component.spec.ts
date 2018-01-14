import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApiService} from '../api.service';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import {DebugElement} from '@angular/core';
import { By } from '@angular/platform-browser';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {SharedModule, DropdownModule, SelectItem } from 'primeng/primeng';
import { MapComponent } from './map.component';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>,
  debugElement: DebugElement, element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        SharedModule,
        DropdownModule,
        LeafletModule,
        LeafletMarkerClusterModule       
      ],
      providers: [
        {
          provide: ApiService, useValue: {
          getGeoData(tagName) {
            return Observable.of({
              "record": [
                {
                  "ip": "66.249.80.1",
                  "lat": 32.7787,
                  "long": -96.8217
                },
                {
                  "ip": "66.102.6.191",
                  "lat": 37.419200000000004,
                  "long": -122.0574
                }
              ]
            });
          },
          getOnlyNames() {
           return Observable.of({
              "tags": [
              {
                name: "GOOGLEBOT"
              },
              {
                name: "BINGBOT"
              }]
            });
          },
    }}]
  })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call tagChangeMap on dropdown change', async(() => {
    const spy = spyOn(component, 'tagChangeMap').and.callThrough();
    fixture.detectChanges();

    //component.tagChangeMap("GOOGLEBOT");
    const select = fixture.debugElement.query(By.css('#map-drop select'));
    const googleOpt = fixture.debugElement.queryAll(By.css('option'))[0];

    expect(googleOpt.nativeElement.selected).toBe(true);

    select.nativeElement.value = "GOOGLEBOT";
    select.nativeElement.dispatchEvent(new Event("onChange", { bubbles: true }));
    fixture.detectChanges(); 

    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
    });
  }));

});
