import { userModel } from './users.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, take, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HousesService {
  private _houses = new BehaviorSubject<userModel[]>([]);

  dataUrl = 'http://localhost:3001/users';

  constructor(private http: HttpClient) {}

  get houses() {
    return this._houses.asObservable();
  }

  fetchHouses() {
    return this.http.get<any>(this.dataUrl).pipe(
      map((usersData) => {
        const houses = [];
        for (const key in usersData) {
          houses.push(
            new userModel(
              key,
              usersData[key].userId,
              usersData[key].name,
              usersData[key].houses
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

  filterRent() {
    console.log(this.houses)
  }

  //   console.log(`Peguei o contrato: ${this.data}`)
  // }

  // fetchHouses() {
  //   return this.http.get<any>(this.dataUrl).pipe(tap(data => console.log(data)))
  // }
}
