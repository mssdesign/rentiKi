import { HousesService } from './../houses.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { offersModel } from '../offers.model';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-house',
  templateUrl: './house.page.html',
  styleUrls: ['./house.page.scss'],
})
export class HousePage implements OnInit, OnDestroy {
  //offer: any;
  useOffer: any;
  private offerSub: Subscription;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private housesService: HousesService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('userOfferId') || !paramMap.has('offerKey')) {
        this.navCtrl.navigateBack('/houses');
        return;
      }

      const userOfferId = paramMap.get('userOfferId');
      const offerKey = paramMap.get('offerKey');

      this.isLoading = true;

      this.housesService.getHouse(userOfferId, offerKey).subscribe((offer) => {
        this.useOffer = offer;
        this.isLoading = false;
      });
    });
  }

  ngOnDestroy() {
    //Arrumar isso aqui também
  }
}
