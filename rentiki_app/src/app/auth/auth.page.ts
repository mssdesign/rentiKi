import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

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
    private router: Router
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
      this.auth.signInUser(email, password).subscribe(resData => console.log(resData));
      this.router.navigateByUrl('/houses')
    } else {
      this.auth.signUpUser(email, password).subscribe(resData => console.log(resData));
    }
    
    form.reset();    
  }

  onSwitchAuth() {
    this.isLogin = !this.isLogin;
  }

}
