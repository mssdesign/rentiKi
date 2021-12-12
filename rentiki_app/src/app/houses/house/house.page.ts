import { HousesService } from './../houses.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { offersModel } from '../offers.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-house',
  templateUrl: './house.page.html',
  styleUrls: ['./house.page.scss'],
})
export class HousePage implements OnInit, OnDestroy {
  offer: any;
  useOffer: any;
  private offerSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private housesService: HousesService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('houseOfferKey')) {
        this.navCtrl.navigateBack('/houses');
        return
      }

      this.offer = this.housesService.getHouse(paramMap.get('houseOfferKey'))
    })
    
    this.offer.subscribe((offer) => {
      this.useOffer = offer;
    })
  }

  ngOnDestroy() {
    //Arrumar isso aqui também
  }

}
