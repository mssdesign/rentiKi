import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HousesService {

  dataUrl = 'http://localhost:3001/users'

  constructor(private http: HttpClient) { }

  fetchHouses() {
    return this.http.get<any>(this.dataUrl);     
  }

}
