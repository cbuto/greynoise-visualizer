import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApiService} from '../api.service';
import {TableModule} from 'primeng/table';
import {DataTable} from 'primeng/components/datatable/datatable'; 
import {SharedModule, DropdownModule, SelectItem, BlockUIModule, DialogModule } from 'primeng/primeng';

import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>,
  debugElement: DebugElement, element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableComponent ],
      imports: [
        TableModule,
        SharedModule,
        DropdownModule, 
        BlockUIModule,
        HttpClientModule,
        BrowserAnimationsModule,
        DialogModule
      ],
      providers: [
        {
          provide: ApiService, useValue: {
          getTags() {
            return Observable.of({
              "tags":[
              {
                name: 'GOOGLEBOT', 
                category: 'actor', 
                intention: 'Null',
                confidence: 'low'
              }]
            });
          },
         getTagData(tagName: string) {
           return Observable.of({
              "records": [
              {
                "asn": "AS13238", 
                "category": "search_engine", 
                "confidence": "high", 
                "datacenter": "Test", 
                "first_seen": "2017-09-27", 
                "intention": "benign", 
                "ip": "5.255.250.2", 
                "last_updated": "2017-09-28", 
                "name": "YANDEX_SEARCH_ENGINE", 
                "org": "YANDEX LLC", 
                "os": "Windows XP", 
                "rdns": "5-255-250-2.spider.yandex.com"
              },
              {
                "asn": "AS13238", 
                "category": "search_engine", 
                "confidence": "high", 
                "datacenter": "Test", 
                "first_seen": "2017-09-27", 
                "intention": "benign", 
                "ip": "5.255.250.2", 
                "last_updated": "2017-09-28", 
                "name": "YANDEX_SEARCH_ENGINE", 
                "org": "YANDEX LLC", 
                "os": "Windows XP", 
                "rdns": "5-255-250-2.spider.yandex.com"
              }]
            });
          },
          getIpData(ip: string) {
           return Observable.of({
              "records": [
                {
                  "category": "activity", 
                  "confidence": "low", 
                  "first_seen": "2017-09-27", 
                  "intention": "Null", 
                  "last_updated": "2017-09-27", 
                  "name": "ELASTICSEARCH_SCANNER"
                }, 
                {
                  "category": "actor", 
                  "confidence": "high", 
                  "first_seen": "2017-09-27", 
                  "intention": "benign", 
                  "last_updated": "2017-10-19", 
                  "name": "SHODAN"
                }]
            });
          }
        }
      }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display data in main table', async(() => {
    fixture.detectChanges();
    const cells = debugElement.queryAll(By.css('#mainTable tbody tr'));

    expect(cells.length).toBe(1);
   }));

  it('should call loadTagInstances() on row expand', async(() => {
    const spy = spyOn(component, 'loadTagInstances');
    fixture.detectChanges();

    const cell = debugElement.queryAll(By.css('#mainTable tbody tr td a'))[0];
    spy.and.callThrough();
    cell.nativeElement.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
       expect(spy).toHaveBeenCalled();
    });

  }));

  it('should call showDialog on IP row select', async(() => {
    const spyIP = spyOn(component, 'showDialog').and.callThrough();
    fixture.detectChanges();

    const spyTagInstances = spyOn(component, 'loadTagInstances');
    fixture.detectChanges();

    const cell = debugElement.queryAll(By.css('#mainTable tbody tr td a'))[0];
    spyTagInstances.and.callThrough();
    cell.nativeElement.click();
    fixture.detectChanges();
    

    const row = debugElement.queryAll(By.css('#secondaryTable tbody tr td'))[0];
    row.nativeElement.click();
    fixture.detectChanges();    

    fixture.whenStable().then(() => {
      expect(spyIP).toHaveBeenCalled();
    });

  }));
  
});
