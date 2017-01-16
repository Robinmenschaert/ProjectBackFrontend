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

  public loginForm = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required]
  });

  constructor(public fb: FormBuilder, private http:Http, private router: Router) {
    this.init();
  }

  init = () => {

  }

  doLogin = (event) => {
    this.loginFormSubmitAttempted = true;
    if (this.loginForm.valid) {
      //console.log(event);
      //console.log(this.loginForm.value);
      var body = 'username='+ this.loginForm.value.username +'&password=' + this.loginForm.value.password;
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      this.http
        .post('http://localhost:3000/login', body, { headers: headers })
        .subscribe((data: Response) => {
          console.log(data.text());
          // token opslaan in de angular 2 lokal staroge
          localStorage.setItem('token', data.text());
          this.router.navigate(['game']);
        }, error => {
            console.log(JSON.stringify(error.json()));
        });
    }
  }

}
