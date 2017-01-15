import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Http, Headers } from '@angular/http';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  public regsterFormSubmitAttempted: boolean = false;

  public registerForm = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required]
  });

  constructor(public fb: FormBuilder, private http:Http) {}

  doRegister(event) {
    this.regsterFormSubmitAttempted = true;
    if (this.registerForm.valid) {
      console.log(event);
      console.log(this.registerForm.value);

      var body = 'username=myusername&password=mypassword';
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      this.http
        .post('localhost:3000/register',
          body, {
            headers: headers
          })
          .subscribe(data => {
                alert('ok');
          }, error => {
              console.log(JSON.stringify(error.json()));
          });


    }
  }

  ngOnInit() {
  }

}
