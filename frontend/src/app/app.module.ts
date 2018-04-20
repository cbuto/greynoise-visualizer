import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';

//primeng
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {ChartModule} from 'primeng/chart';
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuItem} from 'primeng/api';
import {BlockUIModule} from 'primeng/blockui';
import {PanelModule} from 'primeng/panel';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DialogModule} from 'primeng/dialog';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

import { RouteRoutingModule } from './route/route-routing.module';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';

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
    MessageModule,
    NgbModule.forRoot()
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
