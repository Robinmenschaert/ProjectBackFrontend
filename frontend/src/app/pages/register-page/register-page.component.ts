import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  public regsterFormSubmitAttempted: boolean = false;
  public responseCode: number = 0;

  public registerForm = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required]
  });

  constructor(public fb: FormBuilder, private http:Http, private router: Router) {}

  doRegister(event) {
    this.regsterFormSubmitAttempted = true;
    if (this.registerForm.valid) {
      var body = 'username='+ this.registerForm.value.username +'&password=' + this.registerForm.value.password;
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      this.http
        .post('http://localhost:3000/register',
          body, {
            headers: headers
          })
          .subscribe((data: Response) => {
            if (data.json().code === 400 || 401) {
              this.responseCode = data.json();
            }
            if (data.json() === 200) {
              //gelukt redirect naar login
              this.router.navigate(['']);
            }
          }, error => {
              console.log(JSON.stringify(error.json()));
          });


    }
  }

  ngOnInit() {
  }

}
