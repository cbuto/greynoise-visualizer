import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DataTableModule,SharedModule, DropdownModule, ChartModule, TabMenuModule, MenuItem, BlockUIModule, PanelModule, ButtonModule, InputTextModule} from 'primeng/primeng';
import { RouteRoutingModule } from './route/route-routing.module';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';

import { AppComponent } from './app.component';
import { ApiService } from './api.service';
import { TableComponent } from './table/table.component';
import { StatsComponent } from './stats/stats.component';
import { MapComponent } from './map/map.component';



@NgModule({
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
    DataTableModule,
    SharedModule,
    DropdownModule, 
    RouteRoutingModule,
    TabMenuModule, 
    ChartModule,
    BlockUIModule,
    FormsModule,
    PanelModule,
    ButtonModule,
    LeafletModule,
    LeafletMarkerClusterModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
