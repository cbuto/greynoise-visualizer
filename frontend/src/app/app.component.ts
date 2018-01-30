import { Component } from '@angular/core';
import {TabMenuModule, MenuItem} from 'primeng/primeng';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items: MenuItem[];
  
    ngOnInit() {
      //tab menu items
        this.items = [
        	{label: 'Table', icon: 'fa-database', routerLink: ['table']},
          {label: 'IP Search', icon: 'fa-search', routerLink: ['ip']},
          {label: 'Map', icon: 'fa-map', routerLink: ['map']},
          {label: 'Stats', icon: 'fa-bar-chart', routerLink: ['stats']}
        ];
    }
}