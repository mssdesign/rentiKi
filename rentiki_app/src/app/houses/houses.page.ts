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
  isLoading = false;
  housesLoaded: offersModel[];
  housesRent: offersModel[]; //HouseModel[];
  housesSell: offersModel[];
  private housesSub: Subscription;

  constructor(private housesService: HousesService) {}

  ngOnInit() {
    this.housesSub = this.housesService.houses.subscribe((houses) => {
      this.housesLoaded = houses;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.housesService.fetchHouses().subscribe(() => {
      this.isLoading = false;
    });
  }

  filterRent() {
    if (this.housesLoaded) {
      this.housesRent = this.housesLoaded.filter((offersModel) => {
        if (offersModel['contract'] === 'aluguel') {
          return true;
        }
      });
    }
  }

  filterSell() {
    if (this.housesLoaded) {
      this.housesSell = this.housesLoaded.filter((offersModel) => {
        if (offersModel['contract'] === 'venda') {
          return true;
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.housesSub) {
      this.housesSub.unsubscribe();
    }
  }
}
