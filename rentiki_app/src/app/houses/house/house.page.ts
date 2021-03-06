import { HousesService } from './../houses.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  telNum: string;
  whatsappLink: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private housesService: HousesService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.offerSub = this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('userOfferId') || !paramMap.has('offerKey')) {
        this.navCtrl.navigateBack('/houses');
        return;
      }

      const userOfferId = paramMap.get('userOfferId');
      const offerKey = paramMap.get('offerKey');

      this.isLoading = true;

      this.housesService.getHouse(userOfferId, offerKey).subscribe((offer) => {
        this.useOffer = offer;
        this.maskPhone(offer.contact);
        this.whatsappLink = `https://api.whatsapp.com/send?phone=+550${offer.contact}`
        this.isLoading = false;      
      });
    });
  }

  maskPhone(phone: string) {
    let number = phone;
    number = number.replace(/\D/gi, ''); //Retirando caracteres que não são números    
    number = number.replace(/^(\d{2})(\d)/g, '($1) $2'); //Separando DDD do resto do número com parênteses
    number = number.replace(/(\d)(\d{4})$/, '$1-$2'); //Colocando hífen entre os 4 ou 5 primeiros números
    this.telNum = number;
  }

  callZap(phone: string) {
    console.log(phone)
  }

  ngOnDestroy() {
    if (this.offerSub) {
      this.offerSub.unsubscribe();
    }
  }
}
