import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

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
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {

  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return
    }

    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
    console.log(email, password)

    if (this.isLogin) {
      this.auth.signUpUser(email, password).subscribe(a => console.log(a)); //apagar
    } else {
      this.auth.signUpUser(email, password).subscribe(a => console.log(a));
    }
    
    form.reset();    
  }

  onSwitchAuth() {
    this.isLogin = !this.isLogin;
  }

}
