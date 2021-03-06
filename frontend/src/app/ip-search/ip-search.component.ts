import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Location} from '@angular/common';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import * as L from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ActivatedRoute, Params } from '@angular/router';

//primeng
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {Message} from 'primeng/api';

@Component({
  selector: 'app-ip-search',
  templateUrl: './ip-search.component.html',
  styleUrls: ['./ip-search.component.css']
})
export class IpSearchComponent implements OnInit {

  constructor(private _apiService: ApiService, 
  	private route: ActivatedRoute,
    private location: Location) { }

	//ip for link
	ipLink: string;
	hasIPLink: any;
	ipSearchedFor: string;

	//table rows
	ipRows: any;

	//vars for service calls
	ipData: any;
	geoData: any;

	//form vars
	search: FormControl;
	searchForm: FormGroup;

	//if ip doesn't exist msg
	msgs: Message[] = [];

	//map stuff
	layers: L.Layer[] = [];
	markerIP: any;
	LAYER_OSM = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.' });
	map: L.Map;
	// Values to bind to Leaflet Directive
	options = {
	layers: [ this.LAYER_OSM ],
	zoom: 2,
	center: L.latLng(25.6, -8.6)
	};

	center: any;

	ngOnInit() {
		//search form init
		this.searchForm = new FormGroup ({
			search: new FormControl('', [Validators.required, Validators.pattern('^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$')])
		});

		//get IP param
		this.route.params
			.subscribe((params: Params) => this.ipLink = params['ip']);

		//check if ip param is not undefined
		this.hasIPLink = this.ipLink != undefined;

		//if ip param is not undefined
		//load data according to ip param
		if(this.hasIPLink){
			this.loadIPData(this.ipLink);
		}

	}

	//load data on search 
	loadIPDataOnSearch(){
		if(this.searchForm.value.search != ""){
			//call function to load data based on search item
			this.loadIPData(this.searchForm.value.search);
			//change url for easy linking to results
			this.location.replaceState("/ip/" + this.searchForm.value.search);
		}
	}

	loadIPData(ip){
		this.getIpData(ip).subscribe(_ => {;
				//if the ip is not found, display error msg
				//reset rows and map
				if(this.ipData.records === "unknown") {
					this.msgs = [];
					this.msgs.push({severity:'error', summary:'Error', detail:'IP Not Found'});
					this.ipRows = [];
					this.layers = [];
					this.ipSearchedFor = ip;
				}
				//else the ip is found
				//set table rows and load map
				else{
					this.msgs = [];
					this.ipRows = this.ipData.records;
					this.loadMapMarker(ip);
					this.ipSearchedFor = ip;
				}
		});
	}
    //load data into map
	loadMapMarker(ip){
		//retreive lat/long of single IP
		this.getGeoDataSingleIP(ip).subscribe(_ => {;
			//reset layers
			this.layers = [];
			//create a marker with the lat, long, and IP
			this.markerIP = L.marker([this.geoData.record.lat, this.geoData.record.long], { title: ip, 
						icon: L.icon({
							iconSize: [ 25, 41 ],
							iconAnchor: [ 13, 41 ],
							iconUrl: 'assets/marker-icon.png',
							shadowUrl: 'assets/marker-shadow.png'
						})});
			//pop up to show IP
			this.markerIP.bindPopup(ip);
			//add marker to layer
			this.layers.push(this.markerIP);
			this.center = L.latLng(this.geoData.record.lat, this.geoData.record.long);
		});	
	}

	//gets all associated tags for an IP
	getIpData(ip: string){
		return this._apiService
			.getIpData(ip)
			.map(
				(data) => {
					this.ipData = data;
			})
			.catch((error) => {
				this.msgs = [];
				this.msgs.push({severity:'error', summary:'Error', detail:'Something went wrong!'});
				return Observable.empty();
			});
	}

	//get geo location data for a single IP
	getGeoDataSingleIP(ip){
		return this._apiService
			.getGeoDataSingleIP(ip)
			.map(
				(data) => {
					this.geoData = data;
			})
			.catch((error) => {
				this.msgs = [];
				this.msgs.push({severity:'error', summary:'Error', detail:'Geo data not found!'});
				return Observable.empty();
			});
	}
}