import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AviationstackService {

  constructor(private http: HttpClient) {}

  airports(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const endpoint = `${environment.urlAviation}airports?${environment.accessKey}`;
      this.http.get(endpoint).subscribe({
        next: (res) => {
          resolve(res);
        },
        error: (err) => {
          reject(err.error);
        },
      });
    });
  }

  flights(iata:any, offset:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const endpoint = `${environment.urlAviation}flights?${environment.accessKey}&${iata}&offset=${offset}&limit=20`;
      this.http.get(endpoint).subscribe({
        next: (res) => {
          resolve(res);
        },
        error: (err) => {
          reject(err.error);
        },
      });
    });
  }

}
