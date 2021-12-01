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
  usersLoaded: userModel[];
  usersSub: Subscription;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.usersSub = this.auth.users.subscribe((users) => {
      this.usersLoaded = users;
    })
  }

  onClick() {
    this.auth.fetchUsers().subscribe();
  }

  ngOnDestroy() {
    if (this.usersSub) {
      this.usersSub.unsubscribe();
    }
  }

}
