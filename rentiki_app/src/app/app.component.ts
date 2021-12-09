import { AuthService } from './auth/auth.service';
import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private menuCtrl: MenuController, private auth: AuthService) {}
  money = '../assets/icon/money.svg';

  onLogout() {
    this.auth.logout();
  }

  closeMenu() {
    this.menuCtrl.close();
  }

}
