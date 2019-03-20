import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from '../../services/auth-guard.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../model/User';
import { isNullOrUndefined } from 'util';
import { LocalStorageService } from '../../services/local/local.storage.service';

@Component({
  selector: 'app-info-form',
  template: ''
})
export class InfoFormComponent implements OnInit {

  /**************************************************************************************************************
  | Questo componente rappresenta il generico componente di inserimento informazioni (non ha un template html)  *
  | implementa funzionalità per salvare e caricare le info sia da localStorage che da server remoto             *
  | essendo questa una versione puramente REST del client si è ricreato il funzionamento dello scope di         *
  | conversazione di CDI, lo stato della conversazione viene mantenuto su localStorage e sincronizzato solo     *
  | alla fine (quando si torna alla home page)                                                                  *
  | le funzionalità implementate qui sono usate dai 3 componenti di inserimento informazioni utente             *
  |                                                                                                             *
  ***************************************************************************************************************/

  constructor(
    protected  userService: UserService,
    protected router: Router ) {

  }

  stringUser: string;

  saveInfo(): void {
    /* ogni volta che si cambia pagina fra quelle di inserimento info
       salvo tutto lo user sul bean di conversazione del server
    */
    console.log('salvataggio conversazione');
    this.stringUser = JSON.stringify({

      firstname: this.userService.user.firstname,
      secondname: this.userService.user.secondname,
      age: this.userService.user.age,
      country: this.userService.user.country,
      city: this.userService.user.city,
      address: this.userService.user.address,
      mainHobby: this.userService.user.mainHobby,
      job: this.userService.user.job,
      favTvShow: this.userService.user.favTvShow

    });
    this.userService.updateConversation(this.stringUser);
    console.log('utente aggiornato');

  }

  closeInfoAndSave() {
    /* si salva su local storage, in modo da ripristinare tutto in caso di refresh della pagina
    */
    this.saveInfo();
    this.userService.updateUser(this.stringUser).subscribe(
      (user) => {
        console.log('remote user updated');
      }
    );
    this.userService.endConversation();
    this.router.navigate(['/app-home']);
    console.log('conversazione chiusa');
  }


  protected initUser() {
    /* inizializzo l'utente locale con quello remoto persistito su local storage
    */
    this.userService.getUserInfo();
  }

  ngOnInit() {
    this.initUser();
  }
}
