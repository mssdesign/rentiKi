import { offersModel } from './../houses/offers.model';
import { take, tap, map } from 'rxjs/operators';
import { HousesService } from './../houses/houses.service';
import { Subscription } from 'rxjs';
import { userModel } from './../auth/users.model';
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
    this.userOffersSub = this.auth.userId.subscribe(userId => {
      this.housesService.getMyOffers(userId).subscribe(data => {
        this.offersLoaded = data;
      });
    })
  }

  ngOnDestroy() {
    if (this.userOffersSub) {
      this.userOffersSub.unsubscribe();
    }
  }
}
