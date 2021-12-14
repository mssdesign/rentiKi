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
  private _userOffers = new BehaviorSubject<offersModel[]>([]);
  private _storage: Storage | null = null;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthService
  ) {
    this.saveLocal(); //Executando função que cria base local de dados
  }

  images = [
    //Apagar
    'https://media.gettyimages.com/photos/self-build-country-home-morning-mist-picture-id680520047?s=2048x2048',
    'https://imagens-revista.vivadecora.com.br/uploads/2021/03/1-decora%C3%A7%C3%A3o-moderna-para-quarto-feminino-pequeno-cinza-com-m%C3%B3veis-planejados-Foto-Sua-Decora%C3%A7%C3%A3o.jpg',
    'https://www.italinea.com.br/antigo/wp-content/uploads/2019/12/face_2801-internas_3.png',
    'https://revistanews.com.br/wp-content/uploads/2018/08/quarto-infantil.jpg',
    'https://www.plantapronta.com.br/projetos/154/21.jpg',
  ];

  get houses() {
    return this._houses.asObservable();
  }

  get userOffers() {
    return this._userOffers.asObservable();
  }

  //Enviando anúncios para firebase
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
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http
          .get<any>(
            `https://rentiki-default-rtdb.firebaseio.com/offers.json?auth=${token}`
          )
          .pipe(
            take(1),
            switchMap(async (data) => {
              const offersData = [];
              for (const [userId, offers] of Object.entries(data)) {
                for (const [offerId, data] of Object.entries(offers)) {
                  offersData.push([offerId, data]);
                }
              }

              const houses = [];
              for (const offer in offersData) {        
                houses.push(
                  new offersModel(
                    offersData[offer][1].userId,
                    offersData[offer][0], //OfferId
                    offersData[offer][1].contract,
                    offersData[offer][1].title,
                    offersData[offer][1].description,
                    offersData[offer][1].price,
                    offersData[offer][1].contact,
                    offersData[offer][1].whatsapp,
                    offersData[offer][1].location,
                    offersData[offer][1].images,
                    (offersData[offer][1].favorite = await this.getFavorite(
                      offersData[offer][0]
                    ))
                  )
                );
              }

              return houses;
            }),
            tap(async (houses) => {
              this._houses.next(await houses);
            })
          );
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

  //Pegando anúncios do usuário logado
  getMyOffers(userId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<any>(
          `https://rentiki-default-rtdb.firebaseio.com/offers/${userId}.json?auth=${token}`
        ).pipe(
          take(1),
          switchMap(async (offerData) => {
            const userOffers = [];
            for (const [offerId, data] of Object.entries(offerData)) {
              userOffers.push([offerId, data])
            }

            const offers = [];
            for (const offer in userOffers) {
              offers.push(
                new offersModel(
                  userOffers[offer][1].userId,
                  userOffers[offer][0],
                  userOffers[offer][1].contract,
                  userOffers[offer][1].title,
                  userOffers[offer][1].description,
                  userOffers[offer][1].price,
                  userOffers[offer][1].contact,
                  userOffers[offer][1].whatsapp,
                  userOffers[offer][1].location,
                  userOffers[offer][1].images,
                  userOffers[offer][1].favorite
                )
              )
            }

            return offers;
          }),
          tap(offers => {
            this._userOffers.next(offers);
          })
        )
      })
    );
  }

  //Deletando anúncios do usuário logado
  deleteOffer(userId: string, offerKey: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete<any>(
          `https://rentiki-default-rtdb.firebaseio.com/offers/${userId}/${offerKey}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.userOffers;
      }),
      take(1),
      tap(userOffers => {
        this._userOffers.next(userOffers.filter(offer => offer.offerKey !== offerKey))
      })
    );
  }

  //Armazenando os dados do fetching
  getHouse(userId: string, offerKey: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<any>(
          `https://rentiki-default-rtdb.firebaseio.com/offers/${userId}/${offerKey}.json?auth=${token}`
        )
      })
    );
  }
  
}
