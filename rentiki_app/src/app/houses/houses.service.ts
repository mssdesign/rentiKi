import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { offersModel } from './offers.model';
import { catchError, map, take, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HousesService {
  private _houses = new BehaviorSubject<offersModel[]>([]);

  dataUrl = 'http://localhost:3001/offers';

  constructor(private http: HttpClient) {}

  get houses() {
    return this._houses.asObservable();
  }

  fetchHouses() {
    return this.http.get<any>(this.dataUrl).pipe(
      map((offersData) => {
        const houses = [];
        for (const key in offersData) {
          houses.push(
            new offersModel(
              key,
              offersData[key].userId,
              offersData[key].name,
              offersData[key].contract,
              offersData[key].title,
              offersData[key].description,
              offersData[key].price,
              offersData[key].contact,
              offersData[key].location,
              offersData[key].images
            )
          );
        }
        return houses;
      }),
      tap((houses) => {
        this._houses.next(houses);
        //console.log(houses)
      })
    );
  }
}
