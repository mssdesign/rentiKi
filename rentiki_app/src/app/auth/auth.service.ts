import { UserDataModel } from './userData.model';
import { environment } from './../../environments/environment';
import { userModel } from './users.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { take, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

export interface AuthResponseData {
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
export class AuthService implements OnDestroy {
  private _users = new BehaviorSubject<userModel[]>([]);
  private _user = new BehaviorSubject<UserDataModel>(null);
  activeLogoutTimer: any;
  userIsAuthenticated = true; //Apagar
  dataUrl = 'http://localhost:3001/users';  //Apagar

  constructor(private httpClt: HttpClient) {}

  get users() {
    return this._users.asObservable();
  }

  // Cadastro
  signUpUser(email: string, password: string) {

    const req = {
      email: email,
      password: password,
      returnSecureToken: true
    }

    return this.httpClt.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`, req);
  }

  // Login
  signInUser(email: string, password: string) {

    const req = {
      email: email,
      password: password,
      returnSecureToken: true
    }

    this.userIsAuthenticated = true;

    return this.httpClt.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`, req);
  }

  logout() {
    this.userIsAuthenticated = false;
  }

  //Pegando usuários do banco
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

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      
    }
  }

  //Pegando dados do usuário do firebase
  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );

    const user = new UserDataModel(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    );
    this._user.next(user);

  }

  ngOnDestroy() {

  }

}
