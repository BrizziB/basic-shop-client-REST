import { Injectable } from '@angular/core';
import { User } from '../../model/User';
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isUndefined, isNullOrUndefined } from 'util';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /*
  in linea di massima credo sia meglio che gli oggetti/variabili caricati da questo servizio
  vengano conservati sui servizi che ne fanno uso!
  Quindi userID è attributo di UserService
  */

  private userIDRemote = 'userID';
  private userRemote = 'conversationUser';


  cleanAll(): void {
    localStorage.clear();
  }

  registerSession(userID): void {
    localStorage.setItem(this.userIDRemote, userID);
  }
  loadSession(): string {
    return localStorage.getItem(this.userIDRemote);
  }
  deleteSession(): void {
    localStorage.removeItem(this.userIDRemote);
  }

  registerUser(user: string): void {
    localStorage.setItem(this.userRemote, user);
  }

  loadUser(): string {
    return localStorage.getItem(this.userRemote);
  }

  deleteUser(): void {
    localStorage.removeItem(this.userRemote);
  }



  constructor() {}

}
