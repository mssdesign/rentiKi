import { userModel } from './users.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _users = new BehaviorSubject<userModel[]>([]);

  dataUrl = 'http://localhost:3001/users';

  constructor(private httpClt: HttpClient) {}

  get users() {
    return this._users.asObservable();
  }

  fetchUsers() {
    return this.httpClt.get<any>(this.dataUrl).pipe(take(1), map(async (usersData) => {

      const users = [];
      for (const user in usersData) {
        users.push(
          new userModel(
            usersData[user].name,
            usersData[user].email,
            usersData[user].userId
          )
        )
      }
      return users;
    }),
    tap(async (users) => {
      this._users.next(await users);
    }))
  }

}
