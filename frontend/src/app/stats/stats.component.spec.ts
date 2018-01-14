import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApiService} from '../api.service';
import {DebugElement} from '@angular/core';
import { By } from '@angular/platform-browser';
import {Observable} from 'rxjs/Observable';
import { TableComponent } from '../table/table.component';
import * as moment from 'moment';
import {SharedModule, DropdownModule, SelectItem, ChartModule, PanelModule, BlockUIModule } from 'primeng/primeng';

import { StatsComponent } from './stats.component';

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>,
  debugElement: DebugElement, element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsComponent ],
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        SharedModule,
        DropdownModule, 
        ChartModule,
        PanelModule, 
        BlockUIModule
      ],
      providers: [
        {
          provide: ApiService, useValue: {
          getTimeSeries(tagName) {
            return Observable.of([
              {
                "timestamp": 1511308800000,
                "hits": 7
              },
              {
                "timestamp": 1511395200000,
                "hits": 4
              },
              {
                "timestamp": 1511481600000,
                "hits": 3
              }
            ]);
          },
          getOnlyNames() {
           return Observable.of({
              "tags": [
              {
                name: "GOOGLEBOT"
              },
              {
                name: "BINGBOT", 
              }]
            });
          },
          getCounts() {
           return Observable.of({
              "counts": {
                  "category": [
                    {
                      "count": 95, 
                      "name": "activity"
                    }, 
                    {
                      "count": 4, 
                      "name": "search_engine"
                    }, 
                    {
                      "count": 12, 
                      "name": "worm"
                    }, 
                    {
                      "count": 8, 
                      "name": "tool"
                    }, 
                    {
                      "count": 19, 
                      "name": "actor"
                    }, 
                    {
                      "count": 2, 
                      "name": "hosting"
                    }, 
                    {
                      "count": 1, 
                      "name": "scanner"
                    }
                  ], 
                  "intention": [
                    {
                      "count": 104, 
                      "name": "Null"
                    }, 
                    {
                      "count": 23, 
                      "name": "benign"
                    }, 
                    {
                      "count": 14, 
                      "name": "malicious"
                    }
                  ]
                }
              }
            );
          },
        }
      }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call tagChange on dropdown change', async(() => {
    const spy = spyOn(component, 'tagChange').and.callThrough();
    fixture.detectChanges();

    //component.tagChange("GOOGLEBOT");
    const select = fixture.debugElement.query(By.css('#time-series-drop select'));

    select.nativeElement.value = "GOOGLEBOT";
    select.nativeElement.dispatchEvent(new Event("onChange", { bubbles: true }));
    fixture.detectChanges();    

    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
    });
  }));

});
