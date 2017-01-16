import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { GamePageComponent }     from './pages/game-page/game-page.component';
import { LoginPageComponent }    from './pages/login-page/login-page.component';
import { RegisterPageComponent }    from './pages/register-page/register-page.component';

const appRoutes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'game', component: GamePageComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}
