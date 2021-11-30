import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { offersModel } from './offers.model';
import { catchError, map, take, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class HousesService {
  private _houses = new BehaviorSubject<offersModel[]>([]);
  private _storage: Storage | null = null;

  dataUrl = 'http://localhost:3001/offers';

  constructor(private http: HttpClient, private storage: Storage) {
    this.saveLocal(); //Executando função que cria base local de dados
  }

  get houses() {
    return this._houses.asObservable();
  }

  fetchHouses() {
    return this.http.get<any>(this.dataUrl).pipe(
      take(1),
      map(async (offersData) => {
        const houses = [];
        for (const key in offersData) {
          houses.push(
            new offersModel(
              offersData[key].userId,
              offersData[key].offerKey,
              offersData[key].contract,
              offersData[key].title,
              offersData[key].description,
              offersData[key].price,
              offersData[key].whatsapp,
              offersData[key].contact,
              offersData[key].location,
              offersData[key].images,
              offersData[key].favorite = await this.getFavorite(offersData[key].offerKey)
            )
          );
        }
        return houses;
      }),
      tap(async (houses) => {
        this._houses.next(await houses);
        //console.log(houses)
      })
    );
  }

  //A função abaixo foi feita com base em: https://github.com/ionic-team/ionic-storage
  async saveLocal() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  //Método para armazenar os favorites localmente e fazer o toggle
  async favoriteToggle(offerKey: string) {
    if (await this.getFavorite(offerKey) === true) {
      await this._storage.set(offerKey, false);
    } else {
      await this._storage.set(offerKey, true);
    }
  }

  //Pegando o status de favorito do armazenamento local
  async getFavorite(offerKey: string) {
    if (await this._storage.get(offerKey) === null) {
      return false;
    } else {
      return await this._storage.get(offerKey);
    }       
  }

  getHouse(offerKey: string) {
    return this.houses.pipe(
      take(1),
      map((housesData) => {
        for (let house in housesData) {
          if (house && housesData[house]['offerKey'] === offerKey) {
            //console.log(housesData[house])
            return new offersModel(
              housesData[house]['userId'],
              housesData[house]['offerKey'],
              housesData[house]['contract'],
              housesData[house]['title'],
              housesData[house]['description'],
              housesData[house]['price'],
              housesData[house]['contact'],              
              housesData[house]['whatsapp'],
              housesData[house]['location'],
              housesData[house]['images'],
              housesData[house]['favorite']
            );
          }
        }
      })
    );
  }
}
