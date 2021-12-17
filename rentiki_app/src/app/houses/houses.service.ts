import { AuthService } from './../auth/auth.service';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { offersModel } from './offers.model';
import { switchMap, take, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HousesService implements OnDestroy {
  private _houses = new BehaviorSubject<offersModel[]>([]);
  private _userOffers = new BehaviorSubject<offersModel[]>([]);
  private _images = new BehaviorSubject<any[]>([]);
  private _storage: Storage | null = null;
  timer: any;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthService,
    private fireStorage: AngularFireStorage
  ) {
    this.saveLocal(); //Executando função que cria base local de dados
  }

  get houses() {
    return this._houses.asObservable();
  }

  get userOffers() {
    return this._userOffers.asObservable();
  }

  get images() {
    return this._images.asObservable();
  }

  addHouses(
    contract: string,
    title: string,
    description: string,
    price: string,
    contact: string,
    whatsapp: boolean,
    location: string,
    images: string[]
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
          images,
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
        return this.http
          .get<any>(
            `https://rentiki-default-rtdb.firebaseio.com/offers/${userId}.json?auth=${token}`
          )
          .pipe(
            take(1),
            switchMap(async (offerData) => {

              if (!offerData) {
                return;
              }

              const userOffers = [];
              for (const [offerId, data] of Object.entries(offerData)) {
                userOffers.push([offerId, data]);
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
                );
              }

              return offers;
            }),
            tap((offers) => {
              this._userOffers.next(offers);
            })
          );
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
      tap((userOffers) => {
        this._userOffers.next(
          userOffers.filter((offer) => offer.offerKey !== offerKey)
        );
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
        );
      })
    );
  }

  //Instalei firebase tools
  //Dei firebase init
  //ng add @angular/fire
  //Foram adicionados arquivos no app.module e nesse service conforme a documentação nos links abaixo
  //https://github.com/angular/angularfire
  //https://github.com/angular/angularfire/blob/master/docs/storage/storage.md
  async uploadImages(images: File[]) {
    let userId;
    let fireUrl = [];
    let filePath;
    this.authService.userId.subscribe((data) => {
      userId = data;
    });

    for (let image = 0; image < images.length; image++) {
      filePath = `/images/${userId}/${images[image][0]}`; //Caminho da pasta no firebase images[0][0] = nome do arquivo
      const imageBlob = images[image][1]; //Arquivo em blob
      const fileRef = this.fireStorage.ref(filePath); //Pegando referência do arquivo

      this.fireStorage
        .upload(filePath, imageBlob)
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef
              .getDownloadURL()
              .pipe(
                take(1),
                tap((data) => {
                  fireUrl.push(data);                  

                  if (image + 1 === images.length) {
                    this.timer = setTimeout(() => {
                      this._images.next(fireUrl);
                    }, 2000);
                  }
                })
              )
              .subscribe();
          })
        )
        .subscribe();
    }

  }

  ngOnDestroy(): void {
      clearTimeout(this.timer);
      this._images.unsubscribe();
  }

}
