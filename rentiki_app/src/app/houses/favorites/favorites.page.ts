import { HousesService } from './../houses.service';
import { offersModel } from './../offers.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit, OnDestroy {
  isLoading = false;
  housesLoaded: offersModel[];
  private housesFavSub: Subscription;

  constructor(private housesService: HousesService) {}

  ngOnInit() {
    this.housesFavSub = this.housesService.houses.subscribe((houses) => {
      this.housesLoaded = houses.filter(offerHouse => {
        if (offerHouse.favorite === true) {
          return true;
        } else {
          return false;
        }
      })
    })
  }

  ionViewWillEnter() {
    this.housesService.fetchHouses().subscribe();
  }

  onFavoriteToggle(offerKey: string) {
    this.housesService.favoriteToggle(offerKey);
    this.ionViewWillEnter();
    //console.log(offerKey)
  }

  ngOnDestroy() {
    if (this.housesFavSub) {
      this.housesFavSub.unsubscribe();
    }
  }

}
