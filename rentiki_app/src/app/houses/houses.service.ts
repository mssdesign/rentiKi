import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { offersModel } from './offers.model';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class HousesService {
  private _houses = new BehaviorSubject<offersModel[]>([]);
  private _storage: Storage | null = null;

  dataUrl = 'http://localhost:3001/offers';

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthService
  ) {
    this.saveLocal(); //Executando função que cria base local de dados
  }

  images = [  //Apagar
    'https://media.gettyimages.com/photos/self-build-country-home-morning-mist-picture-id680520047?s=2048x2048',
    'https://imagens-revista.vivadecora.com.br/uploads/2021/03/1-decora%C3%A7%C3%A3o-moderna-para-quarto-feminino-pequeno-cinza-com-m%C3%B3veis-planejados-Foto-Sua-Decora%C3%A7%C3%A3o.jpg',
    'https://www.italinea.com.br/antigo/wp-content/uploads/2019/12/face_2801-internas_3.png',
    'https://revistanews.com.br/wp-content/uploads/2018/08/quarto-infantil.jpg',
    'https://www.plantapronta.com.br/projetos/154/21.jpg',
  ];

  get houses() {
    return this._houses.asObservable();
  }

  addHouses(
    contract: string,
    title: string,
    description: string,
    price: string,
    contact: string,
    whatsapp: boolean,
    location: string
  ) {
    let fetchedUserId: string;
    let newOffer: offersModel;
    let nameOfferKey: string;

    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        if (!fetchedUserId) {
          throw new Error('Usuário não encontrado');
        }

        newOffer = new offersModel(
          fetchedUserId,
          Math.random().toString(),
          contract,
          title,
          description,
          price,
          contact,
          whatsapp,
          location,
          this.images,
          false
        );

        return this.http.post<{ name: string }>(
          `https://rentiki-default-rtdb.firebaseio.com/offers/${fetchedUserId}.json?auth=${token}`,
          {
            ...newOffer,
            offerKey: null,
          }
        );
      }),
      switchMap((resData) => {
        //Pegando o id do ANÚNCIO gerado pelo firebase
        nameOfferKey = resData.name;
        return this.houses;
      }),
      take(1),
      tap((houses) => {
        newOffer.offerKey = nameOfferKey;
        this._houses.next(houses.concat(newOffer));
      })
    );
  }

  //Pegando dados do servidor
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
              (offersData[key].favorite = await this.getFavorite(
                offersData[key].offerKey
              ))
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
    if ((await this.getFavorite(offerKey)) === true) {
      await this._storage.set(offerKey, false);
    } else {
      await this._storage.set(offerKey, true);
    }
  }

  //Pegando o status de favorito do armazenamento local
  async getFavorite(offerKey: string) {
    if ((await this._storage.get(offerKey)) === null) {
      return false;
    } else {
      return await this._storage.get(offerKey);
    }
  }

  //Armazenando os dados do fetching
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
