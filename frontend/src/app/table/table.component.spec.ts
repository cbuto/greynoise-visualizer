import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApiService} from '../api.service';
import {DataTableModule, SharedModule, DropdownModule, SelectItem, BlockUIModule, DialogModule } from 'primeng/primeng';

import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>,
  debugElement: DebugElement, element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableComponent ],
      imports: [
        DataTableModule,
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
                asn: "AS13238",
                first_seen: "2018-01-01T02:14:27.962Z",
                ip: "66.249.65.146", 
                last_updated: "2018-01-01T02:14:27.962Z",
                org: "YANDEX LLC",
                rdns: "5-255-250-2.spider.yandex.com",
                rdns_parent: "yandex.com"
              },
              {
                asn: "AS13238",
                first_seen: "2017-01-01T02:14:27.962Z", 
                ip: "66.249.65.145", 
                last_updated: "2017-01-01T02:14:27.962Z",
                org: "YANDEX LLC",
                rdns: "5-255-250-2.spider.yandex.com",
                rdns_parent: "yandex.com"
              }]
            });
          },
          getIpData(ip: string) {
           return Observable.of({
              "record": [
                {
                  "category": "activity", 
                  "confidence": "low", 
                  "first_seen": "2017-09-27T02:27:26.431Z", 
                  "intention": "Null", 
                  "last_updated": "2017-09-27T18:36:14.127Z", 
                  "name": "ELASTICSEARCH_SCANNER"
                }, 
                {
                  "category": "actor", 
                  "confidence": "high", 
                  "first_seen": "2017-09-27T02:26:31.957Z", 
                  "intention": "benign", 
                  "last_updated": "2017-10-19T01:35:34.114Z", 
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
    const cells = debugElement.queryAll(By.css('#mainTable tr.ui-widget-content'));

    expect(cells.length).toBe(1);
   }));

  it('should call loadTagInstances() on row expand', async(() => {
    const spy = spyOn(component, 'loadTagInstances');
    fixture.detectChanges();

    const cell = debugElement.queryAll(By.css('#mainTable .ui-datatable-even .ui-cell-data'))[0];
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

    const cell = debugElement.queryAll(By.css('#mainTable .ui-datatable-even .ui-cell-data'))[0];
    spyTagInstances.and.callThrough();
    cell.nativeElement.click();
    fixture.detectChanges();
    

    const row = debugElement.queryAll(By.css('#secondaryTable .ui-datatable-even .ui-cell-data'))[0];
    row.nativeElement.click();
    fixture.detectChanges();    

    fixture.whenStable().then(() => {
      expect(spyIP).toHaveBeenCalled();
    });

  }));
  
});
