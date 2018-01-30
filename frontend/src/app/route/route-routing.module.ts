import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableComponent } from '../table/table.component';
import { StatsComponent } from '../stats/stats.component';
import { MapComponent } from '../map/map.component';
import { IpSearchComponent } from '../ip-search/ip-search.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/table',
    pathMatch: 'full'
  },
  {
    path: 'table',
    component: TableComponent
  },
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'stats',
    component: StatsComponent
  },
  {
    path: 'ip',
    component: IpSearchComponent
  },
  {
    path: 'ip/:ip',
    component: IpSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
