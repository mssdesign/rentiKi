import { HousesService } from './houses.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { offersModel } from './offers.model';

@Component({
  selector: 'app-houses',
  templateUrl: './houses.page.html',
  styleUrls: ['./houses.page.scss'],
})
export class HousesPage implements OnInit, OnDestroy {
  housesLoadedShow: offersModel[];
  housesLoaded: offersModel[];
  housesRent: offersModel[];
  housesSell: offersModel[];
  private housesSub: Subscription;

  constructor(private housesService: HousesService) {}

  ngOnInit() {
    this.housesSub = this.housesService.houses.subscribe((houses) => {
      this.housesLoaded = houses;
      this.housesLoadedShow = this.housesLoaded;
    });
  }

  ionViewWillEnter() {
    this.housesService.fetchHouses().subscribe();
  }

  filterRent() {
    if (this.housesLoaded) {
      this.housesRent = this.housesLoaded.filter((offersModel) => {
        if (offersModel['contract'] === 'rent') {
          return true;
        }
      });
    }
  }

  filterSell() {
    if (this.housesLoaded) {
      this.housesSell = this.housesLoaded.filter((offersModel) => {
        if (offersModel['contract'] === 'sell') {
          return true;
        }
      });
    }
  }

  onFilterUpdate(event: any) {
    if (event.detail.value === 'all') {
      this.housesLoadedShow = this.housesLoaded;
    } else if (event.detail.value === 'rent') {
      this.filterRent();
      this.housesLoadedShow = this.housesRent;
    } else {
      this.filterSell();
      this.housesLoadedShow = this.housesSell;
    }
  }

  onFavoriteToggle(offerKey: string) {
    this.housesService.favoriteToggle(offerKey);
    this.ionViewWillEnter();
    //console.log(offerKey)
  }

  ngOnDestroy() {
    if (this.housesSub) {
      this.housesSub.unsubscribe();
    }
  }
}
