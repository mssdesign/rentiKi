import { HousesService } from './houses.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { userModel } from './users.model';
import { Subscription } from 'rxjs';
import { HouseModel } from './house.model';

@Component({
  selector: 'app-houses',
  templateUrl: './houses.page.html',
  styleUrls: ['./houses.page.scss'],
})
export class HousesPage implements OnInit, OnDestroy {
  isLoading = false;
  housesLoaded: userModel[];
  test: any[];
  data: any;
  housesRent: HouseModel[];
  housesSell: HouseModel[];
  private housesSub: Subscription;

  constructor(private housesService: HousesService) {}

  ngOnInit() {
    this.housesSub = this.housesService.houses.subscribe(houses => {
      this.housesLoaded = houses;
    })
    this.housesService.filterRent();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.housesService.fetchHouses().subscribe(() => {
      this.isLoading = false;
    })
  }

  ngOnDestroy() {
    if (this.housesSub) {
      this.housesSub.unsubscribe();
    }
  }

  // onfetchHouses() {
  //   this.housesService.fetchHouses().subscribe(houses => {
  //     this.houses = houses
  //     console.log(houses)
  //     return houses
  //   })
  // }

}
