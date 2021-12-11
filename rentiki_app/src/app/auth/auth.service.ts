import { UserDataModel } from './userData.model';
import { environment } from './../../environments/environment';
import { userModel } from './users.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { take, map, tap } from 'rxjs/operators';
import { BehaviorSubject, from } from 'rxjs';
import { Storage } from '@capacitor/storage';

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
  dataUrl = 'http://localhost:3001/users'; //Apagar

  constructor(private httpClt: HttpClient) {}

  get users() {
    return this._users.asObservable();
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    )
  }

  get token() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    )
  }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    )
  }


  // Cadastro
  signUpUser(email: string, password: string) {
    const req = {
      email: email,
      password: password,
      returnSecureToken: true,
    };

    return this.httpClt
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
        req
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  // Login
  signInUser(email: string, password: string) {
    const req = {
      email: email,
      password: password,
      returnSecureToken: true,
    };

    return this.httpClt
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
        req
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  //Pegando usuários do banco
  fetchUsers() {
    return this.httpClt.get<any>(this.dataUrl).pipe(
      take(1),
      map(async (usersData) => {
        const users = [];
        for (const user in usersData) {
          users.push(
            new userModel(
              usersData[user].name,
              usersData[user].email,
              usersData[user].userId
            )
          );
        }
        return users;
      }),
      tap(async (users) => {
        this._users.next(await users);
      })
    );
  }

  //Saindo
  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }

    this._user.next(null);
    Storage.remove({ key: 'authData' });

  }

  //Saindo automaticamente após um tempo
  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }

    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  //Logando automaticamente
  autoLogin() {
    return from(Storage.get({ key: 'authData' })).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }

        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
        };

        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }

        const user = new UserDataModel(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map((user) => {
        return !!user;
      })
    );
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
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email
    );
  }

  //Armzenando autenticação localmente
  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const data = JSON.stringify({
      userId, //Forma reduzida de "userId: userId"
      token,
      tokenExpirationDate,
      email,
    });

    Storage.set({ key: 'authData', value: data });
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
}
