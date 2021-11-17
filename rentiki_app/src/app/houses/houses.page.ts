import { HousesService } from './houses.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-houses',
  templateUrl: './houses.page.html',
  styleUrls: ['./houses.page.scss'],
})
export class HousesPage implements OnInit {

  houses!: any;

  constructor(private housesService: HousesService) {}

  ngOnInit() {
    // this.housesService.fetchHouses().subscribe(houses => {
    //   this.houses = houses
    //   console.log(houses)
    //   return houses
    // })
  }

  onfetchHouses() {
    this.housesService.fetchHouses().subscribe(houses => {
      this.houses = houses
      console.log(houses)
      return houses
    })
  }

  //Fazer fetch no backend e trazer os dados

}
