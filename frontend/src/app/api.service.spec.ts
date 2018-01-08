import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../environments/environment';

import { ApiService } from './api.service';

describe('ApiService', () => {

  let apiService: ApiService; 
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService],
      imports: [
        HttpClientTestingModule
      ]
    });

    apiService = TestBed.get(ApiService); 
    httpMock = TestBed.get(HttpTestingController);

  });

  it('should successfully get tags', inject([
      HttpTestingController, ApiService
    ], (httpMock, apiService) => {
    let response = { 
      "tags": [
          {
          "category": "activity",
          "confidence": "high",
          "intention": "Null",
          "name": "VNC_SCANNER_HIGH"
        }
        ]
      };
    apiService.getTags()
                 .subscribe(data => {
                   expect(data).toEqual(response);
                 });
    const tagNameRequest = httpMock.expectOne(environment.apiUrl + '/api/tags'); 
    tagNameRequest.flush(response);
    httpMock.verify();
  }));


  it('should successfully get tag names', inject([
      HttpTestingController, ApiService
    ], (httpMock, apiService) => {
    let response = { 
      "tags": [
          {"name": "VNC_SCANNER_HIGH"},
          {"name": "PING_SCANNER_LOW"},
          {"name": "BINGBOT"}
        ]
      };
    apiService.getOnlyNames()
                 .subscribe(data => {
                   expect(data).toEqual(response);
                 });
    const tagNameRequest = httpMock.expectOne(environment.apiUrl + '/api/tagnames'); 
    tagNameRequest.flush(response);
    httpMock.verify();
  }));

  it('should successfully get tag instances', inject([
      HttpTestingController, ApiService
    ], (httpMock, apiService) => {
    let response = { 
      "records": [
          {
            "category": "search_engine", 
            "confidence": "high", 
            "first_seen": "2018-01-01T02:14:27.962Z", 
            "intention": "benign", 
            "ip": "66.249.65.146", 
            "last_updated": "2018-01-01T02:14:27.962Z", 
            "name": "GOOGLEBOT"
          }]
      };
    apiService.getTagData("GOOGLEBOT")
                 .subscribe(data => {
                   expect(data).toEqual(response);
                 });
    const tagNameRequest = httpMock.expectOne(environment.apiUrl + '/api/tags/GOOGLEBOT'); 
    tagNameRequest.flush(response);
    httpMock.verify();
  }));

  it('should successfully get time series data', inject([
      HttpTestingController, ApiService
    ], (httpMock, apiService) => {
    let response =
        [{
          "timestamp": 1511222400000,
          "hits": 6
        },
        {
          "timestamp": 1511308800000,
          "hits": 26
        }];
    apiService.getTimeSeries("GOOGLEBOT")
                 .subscribe(data => {
                   expect(data).toEqual(response);
                 });
    const tagNameRequest = httpMock.expectOne(environment.apiUrl + '/api/stats/GOOGLEBOT'); 
    tagNameRequest.flush(response);
    httpMock.verify();
  }));

  it('should successfully get counts', inject([
      HttpTestingController, ApiService
    ], (httpMock, apiService) => {
    let response = { 
      "counts": {
        "category": [
          {
            "count": 95, 
            "name": "activity"
          }]
        }
      };
    apiService.getCounts()
                 .subscribe(data => {
                   expect(data).toEqual(response);
                 });
    const tagNameRequest = httpMock.expectOne(environment.apiUrl + '/api/stats/counts'); 
    tagNameRequest.flush(response);
    httpMock.verify();
  }));

});


