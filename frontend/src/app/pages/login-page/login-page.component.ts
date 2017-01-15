import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  public loginFormSubmitAttempted: boolean = false;

  public loginForm = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required]
  });

  constructor(public fb: FormBuilder) {}

  doRegister(event) {
    this.loginFormSubmitAttempted = true;
    if (this.loginForm.valid) {
      console.log(event);
      console.log(this.loginForm.value);

    }
  }

  ngOnInit() {
  }

}
