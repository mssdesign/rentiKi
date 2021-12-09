import { environment } from './../../environments/environment';
import { userModel } from './users.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _users = new BehaviorSubject<userModel[]>([]);
  userIsAuthenticated = true;
  dataUrl = 'http://localhost:3001/users';

  constructor(private httpClt: HttpClient) {}

  get users() {
    return this._users.asObservable();
  }

  signUpUser(email: string, password: string) {

    const req = {
      email: email,
      password: password,
      returnSecureToken: true
    }

    return this.httpClt.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`, req);
  }

  signUser() {
    this.userIsAuthenticated = true;
  }

  logout() {
    this.userIsAuthenticated = false;
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
