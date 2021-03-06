import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  public loginFormSubmitAttempted: boolean = false;
  public responseCode: number = 0;

  public loginForm = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required]
  });

  constructor(public fb: FormBuilder, private http:Http, private router: Router) {
    this.init();
  }

  init = () => {  }

  doLogin = (event) => {
    this.loginFormSubmitAttempted = true;
    if (this.loginForm.valid) {
      var body = 'username='+ this.loginForm.value.username +'&password=' + this.loginForm.value.password;
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      this.http
        .post('http://localhost:3000/login', body, { headers: headers })
        .subscribe((data: Response) => {
          if (data.json().code === 400) {
            console.log("badrequest");
            this.responseCode = data.json().code;
          }
          if (data.json().code === 200) {
            localStorage.setItem('token', data.json().token);
            localStorage.setItem('username', this.loginForm.value.username);
            this.router.navigate(['game']);
          }
        }, error => {
            console.log(JSON.stringify(error.json()));
        });
    }
  }
  doGuestLogin = () => {
    var body = 'username=guest';
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    this.http
      .post('http://localhost:3000/guestLogin', body, { headers: headers })
      .subscribe((data: Response) => {
        if (data.json().code === 200) {
          localStorage.setItem('token', data.json().token);
          localStorage.setItem('username', data.json().username);
          this.router.navigate(['game']);
        }
      }
      , error => {
          console.log(JSON.stringify(error.json()));
      });
  }

  goToRegister = (event) => {
    this.router.navigate(['register']);
  }
}
