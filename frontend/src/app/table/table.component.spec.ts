import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApiService} from '../api.service';
import {DataTableModule, SharedModule, DropdownModule, SelectItem, BlockUIModule } from 'primeng/primeng';

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
        BrowserAnimationsModule
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
         getTagData(tagName) {
           return Observable.of({
              "records": [
              {
                first_seen: "2018-01-01T02:14:27.962Z",
                ip: "66.249.65.146", 
                last_updated: "2018-01-01T02:14:27.962Z"
              },
              {
                first_seen: "2017-01-01T02:14:27.962Z", 
                ip: "66.249.65.145", 
                last_updated: "2017-01-01T02:14:27.962Z"
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

  it('should display data in table', async(() => {
    fixture.detectChanges();
    const cells = debugElement.queryAll(By.css('tr.ui-widget-content'));

    expect(cells.length).toBe(1);
   }));

  it('should call loadTagInstances() on row expand', async(() => {
    const spy = spyOn(component, 'loadTagInstances');
    fixture.detectChanges();

    const cell = debugElement.queryAll(By.css('.ui-datatable-even .ui-cell-data'))[0];
    spy.and.callThrough();
    cell.nativeElement.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
       expect(spy).toHaveBeenCalled();
    });

  }));



  
});
