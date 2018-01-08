import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class ApiService {

	constructor(private http: HttpClient) {}
	//get tag name, category, intention, and confidence
	getTags(){
  		return this.http.get(environment.apiUrl + '/api/tags')
	}

	//get only tag names
	getOnlyNames(){
  		return this.http.get(environment.apiUrl + '/api/tagnames')
	}

	//get tag instances (IPs, last seen date, and last updated date)
	getTagData(tagName: string){
  		return this.http.post(environment.apiUrl + '/api/tags/' + tagName, null)
	}

	//get time series data
	getTimeSeries(tagName: string){
  		return this.http.post(environment.apiUrl + '/api/stats/' + tagName, null)
	}

	//get counts (intention, categories) for doughnut charts
	getCounts(){
  		return this.http.get(environment.apiUrl + '/api/stats/counts')
	}

}

