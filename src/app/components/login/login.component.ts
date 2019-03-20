import { Component, OnInit } from '@angular/core';

import { User } from '../../model/User';
import { Router } from '@angular/router';

import { AuthGuardService } from '../../services/auth-guard.service';
import { UserService } from '../../services/user.service';

import { LocalStorageService } from '../../services/local/local.storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit  {


/****************************************************************************************
  Questo componente permette il login dell'utente                                       *
  Per farlo utilizza il servizio UserService per inviare al server                      *
  le credenziali inserite, notifica inoltre all AuthService l'avvenuto login            *
  ed il relativo userID, questo abilita il routing verso altre pagine dell'applicazione *
  utilizza anche il LocalStorageService per persistere in locale lo userID, questo      *
  permetterà il ripristino della sessione in caso di refresh del client                 *
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  avrei preferito mettere dipendenza da un solo servizio, era possibile mettendo la     *
  funzione login in AuthService e assegnango a quest'ultimo le responsabilità di        *
  inizializzare gli altri servizi (localStorage e userService) dell'avvenuto login      *
  però non mi è parso così utile, quindi per ora è così                                 *
*****************************************************************************************/

  protected user: User;
  protected loginFailed: boolean;
  private isUserLogged = false;



  private login(): void {
    // preparo il json da inviare per il login - sarà il body della request http
    const body = JSON.stringify({
      email: this.user.email,
      password: this.user.password
    });
    this.usersService.login(body).subscribe((resp) => {
      console.log(resp);
      if (resp !== null) {
        this.user.id = (Number)(resp.body);
        this.usersService.user.id = this.user.id;
        this.usersService.userID = this.user.id;
        this.localStorageService.registerSession(this.user.id);
        this.authService.setUserLogged(true);
        this.authService.setLoggedUser(this.user);
        if (this.user.id !== null) {
          this.router.navigate(['app-home']);
        }
      }
    });
  }

  getUserLogged(): boolean {
    return this.isUserLogged;
  }

  constructor(protected localStorageService: LocalStorageService,
    protected usersService: UserService,
    protected router: Router,
    protected authService: AuthGuardService
    ) {    }

  ngOnInit() {
    this.user = new User();
    this.user.email = '';
    this.user.password = '';
  }



}
