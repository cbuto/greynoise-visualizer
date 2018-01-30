import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SharedModule, DropdownModule, ChartModule, TabMenuModule, MenuItem, BlockUIModule, PanelModule, ButtonModule, InputTextModule, DialogModule, MessagesModule, MessageModule} from 'primeng/primeng';
import { RouteRoutingModule } from './route/route-routing.module';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import {TableModule} from 'primeng/table';
import { AppComponent } from './app.component';
import { ApiService } from './api.service';
import { TableComponent } from './table/table.component';
import { StatsComponent } from './stats/stats.component';
import { MapComponent } from './map/map.component';
import { IpSearchComponent } from './ip-search/ip-search.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    StatsComponent,
    MapComponent,
    IpSearchComponent
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
    ButtonModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    DialogModule,
    ReactiveFormsModule,
    MessagesModule,
    MessageModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
