import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Location} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {DebugElement} from '@angular/core';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import * as L from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {TableModule} from 'primeng/table';
import {SharedModule, ButtonModule, MessagesModule, MessageModule, Message} from 'primeng/primeng';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IpSearchComponent } from './ip-search.component';

describe('IpSearchComponent', () => {
  let component: IpSearchComponent;
  let fixture: ComponentFixture<IpSearchComponent>,
  debugElement: DebugElement, element: HTMLElement;;

 beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpSearchComponent ],
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        SharedModule,
        LeafletModule,
        ButtonModule,
        MessagesModule,
        MessageModule,
        ReactiveFormsModule,
        TableModule,
        RouterTestingModule 
      ],
      providers: [
        {
          provide: ApiService, useValue: {
          getGeoDataSingleIP(ip) {
            return Observable.of({
              "record":
                 {
                  "ip": "66.111.57.56", 
                  "lat": 33.9058, 
                  "long": -84.1803
                }
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
          },
        }
      },
      {
        provide: ActivatedRoute,
          useValue: {
            params: Observable.of({ip: "223.89.85.29"})
          },
      }
    ]
  })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpSearchComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadIPDataOnSearch on submit', async(() => {
    const spy = spyOn(component, 'loadIPDataOnSearch').and.callThrough();
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#ipsearchbox'));
    const button = fixture.debugElement.query(By.css('#submitButton'));

    input.nativeElement.value = "66.111.57.56";
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    button.nativeElement.click()
    
    fixture.detectChanges(); 

    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
    });
  }));

  it('should call loadIPData', async(() => {
    const spy = spyOn(component, 'loadIPData').and.callThrough();
    fixture.detectChanges();

    component.ngOnInit();

    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalledWith("223.89.85.29");
    });

  }));

});

describe('IpSearchComponent IP Not Found', () => {
  let component: IpSearchComponent;
  let fixture: ComponentFixture<IpSearchComponent>,
  debugElement: DebugElement, element: HTMLElement;;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpSearchComponent ],
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        SharedModule,
        LeafletModule,
        ButtonModule,
        MessagesModule,
        MessageModule,
        ReactiveFormsModule,
        TableModule,
        RouterTestingModule 
      ],
      providers: [
        {
          provide: ApiService, useValue: {
          getIpData(ip: string) {
           return Observable.of({
              "records": "unknown"
            });
          }
    }}]
  })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(IpSearchComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should display msg on error', async(() => {

    const input = fixture.debugElement.query(By.css('#ipsearchbox'));
    const button = fixture.debugElement.query(By.css('#submitButton'));

    input.nativeElement.value = "8.8.8.8";
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    button.nativeElement.click()
    
    fixture.detectChanges(); 

    expect(debugElement.query(By.css(".ui-messages-error"))).toBeTruthy(); 
  }));

});

describe('IpSearchComponent link to IP not found', () => {
  let component: IpSearchComponent;
  let fixture: ComponentFixture<IpSearchComponent>,
  debugElement: DebugElement, element: HTMLElement;;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpSearchComponent ],
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        SharedModule,
        LeafletModule,
        ButtonModule,
        MessagesModule,
        MessageModule,
        ReactiveFormsModule,
        TableModule,
        RouterTestingModule 
      ],
      providers: [
        {
          provide: ApiService, useValue: {
          getIpData(ip: string) {
           return Observable.of({
              "records": "unknown"
            });
          }
        }
      },
       {
        provide: ActivatedRoute,
          useValue: {
            params: Observable.of({ip: "8.8.8.8"})
          },
      }
    ]
  })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(IpSearchComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
    fixture.detectChanges();
  });

   it('should display msg on error', async(() => {
     
    component.ngOnInit();

    expect(debugElement.query(By.css(".ui-messages-error"))).toBeTruthy(); 
  }));

});