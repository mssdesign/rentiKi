import { offersModel } from './../houses/offers.model';
import { HousesService } from './../houses/houses.service';
import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  offersLoaded: offersModel[];
  userOffersSub: Subscription;

  constructor(
    private auth: AuthService,
    private housesService: HousesService
  ) {}

  ngOnInit() {
    this.auth.userId.subscribe((userId) => {
      this.housesService.getMyOffers(userId).subscribe();
      this.housesService.userOffers.subscribe((data) => {
        this.offersLoaded = data;
      });
    });
  }

  OnDeleteOffer(userId: string, offerKey: string) {
    this.housesService.deleteOffer(userId, offerKey).subscribe();
  }

  ngOnDestroy() {
    if (this.userOffersSub) {
      this.userOffersSub.unsubscribe();
    }
  }
}
