import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Fazendo Login...' })
      .then((loadingEl) => {
        loadingEl.present();

        let authObservable: Observable<AuthResponseData>;

        if (this.isLogin) {
          //Login
          authObservable = this.auth.signInUser(email, password);
          this.router.navigateByUrl('/houses');
        } else {
          //Cadastro
          authObservable = this.auth.signUpUser(email, password);
        }

        authObservable.subscribe(
          (resData) => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/houses');
          },
          (error) => {
            loadingEl.dismiss();
            this.showAlert(error.error.error.message);
            return this.router.navigateByUrl('/auth');
          }
        );
      });
  }

  //Envia o formulário
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);

    form.reset();
  }

  //Troca ação do botão na página de autenticação
  onSwitchAuth() {
    this.isLogin = !this.isLogin;
  }

  //Mostrando mensagem de erro no login ou cadastro
  private showAlert(message: string) {
    this.alertCtrl
      .create({ header: 'Falha no Login', message: message, buttons: ['Ok'] })
      .then((alertEl) => alertEl.present());
  }
}
