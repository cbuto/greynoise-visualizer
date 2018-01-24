import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule, DropdownModule, ChartModule, TabMenuModule, MenuItem, BlockUIModule, PanelModule, DialogModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {DataTable} from 'primeng/components/datatable/datatable'; 
import { RouteRoutingModule } from './route/route-routing.module';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';

import { AppComponent } from './app.component';
import { ApiService } from './api.service';
import { TableComponent } from './table/table.component';
import { StatsComponent } from './stats/stats.component';
import { MapComponent } from './map/map.component';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>,
  debugElement: DebugElement, element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TableComponent,
        StatsComponent,
        MapComponent
      ],
      imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        TableModule,
        SharedModule,
        DropdownModule, 
        RouteRoutingModule,
        TabMenuModule, 
        ChartModule,
        BlockUIModule,
        FormsModule,
        PanelModule,
        LeafletModule,
        LeafletMarkerClusterModule, 
        DialogModule
      ],
      providers: [ApiService,
      {provide: APP_BASE_HREF, useValue: '/'}],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should create menu', async(() => {
      let items: MenuItem[];
      this.items = [
        {label: 'Table', icon: 'fa-database', routerLink: ['']},
        {label: 'Map', icon: 'fa-map', routerLink: ['map']},
        {label: 'Stats', icon: 'fa-bar-chart', routerLink: ['stats']}
      ];
      const menu = debugElement.queryAll(By.css('.ui-tabmenu-nav li'));
      expect(menu.length).toBe(3);
  }));
  
});
