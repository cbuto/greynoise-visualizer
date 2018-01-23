import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {SharedModule, DropdownModule, SelectItem, BlockUIModule} from 'primeng/primeng';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private _apiService: ApiService) {}

  //map
  geoData: any;
  loadingMap: boolean;

  // Open Street Map definitions (original - http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png)
  LAYER_OSM = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.' });

  // Values to bind to Leaflet Directive
  options = {
    layers: [ this.LAYER_OSM ],
	zoom: 2,
	center: L.latLng(40.473698, -9.492188)
  };

  //marker cluster stuff
  markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData: any[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions;
  markerList: any[] = [];

  //dropdown
  tagNames: any;
  mapDropdownOptions: SelectItem[] = [];

  ngOnInit() {
  	//subcribe to getOnlyNames to create dropdown
		this.getOnlyNames().subscribe(_ => {;
			this.tagNames = this.tagNames.tags.map(data => data.name);
			for(let name of this.tagNames){
				this.mapDropdownOptions.push({label: name, value: name});
			}
		});
  }
  	//on dropdown change, load data into map
  	tagChangeMap(value){
  	  	//clear previous layers (data)
  		this.markerClusterGroup.clearLayers();
  		//call getGeoData to retreive lat/long of IPs
		this.getGeoData(value).subscribe(_ => {;
			//for each IP in geoData
			//create a marker with the lat, long, and IP
			for(let obj of this.geoData.record){
				var marker = L.marker([obj.lat, obj.long], { title: obj.ip, 
						    icon: L.icon({
						      iconSize: [ 25, 41 ],
						      iconAnchor: [ 13, 41 ],
						      iconUrl: 'assets/marker-icon.png',
						      shadowUrl: 'assets/marker-shadow.png'
			    			})});
				//pop up to show IP
				marker.bindPopup(obj.ip);
				//create list of markers
				this.markerList.push(marker);
			}

			this.markerClusterData = this.markerList;
			//add layers to cluster group
			this.markerClusterGroup.addLayers(this.markerClusterData);
			this.loadingMap = false;
    	});	
	}

	markerClusterReady(group: L.MarkerClusterGroup) {

		this.markerClusterGroup = group;

	}
  	//get only tag names (used to create dropdown for map)
	getOnlyNames(){
		return this._apiService
			.getOnlyNames()
			.map(
				(data) => {
					this.tagNames = data;
			})
			.catch((error) => {
				throw error;
			});
	}

  //used to get geo location data for a selected tag
	getGeoData(tagName){
		this.loadingMap = true;
		return this._apiService
			.getGeoData(tagName)
			.map(
				(data) => {
					this.geoData = data;
			})
			.catch((error) => {
				throw error;
			});
	}


}
