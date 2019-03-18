import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isUndefined, isNullOrUndefined } from 'util';
import { LocalStorageService } from './local/local.storage.service';
import { User } from '../model/User';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private conversationActive = false;
  public userID: Number;
  public user: User = new User();

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router
    ) {}

    /*****************************************************************************
      gli errori nelle response non vengono gestiti - per semplicità

      XMLHttpRequest.withCredentials Is a Boolean that indicates whether or not
      cross-site Access-Control requests should be made using credentials such
      as cookies or authorization headers. The default is false.

      [observe: 'response']  serve per leggere tutta la risposta http
    ******************************************************************************/

  public _init(): boolean {
    // serve per essere sempre sicuri che le richieste http includano lo userID
    // per prevedere il caso di refresh, ogni volta che l'attributo userID di userService è null o undefined
    // si controlla il localStorage per cercare lo userId e si usa per il ripristino
    // quando questo non è possibile si reindirizza al login per ottenere un nuovo userID (anche se non dovrebbe succedere)
    if (isNullOrUndefined(this.userID)) {
      const stringUser = this.localStorageService.loadSession();
      if (isNullOrUndefined(stringUser)) {
        alert('sessione non sincronizzata');
        this.router.navigate(['/login']);
        return false;
      } else {
        this.userID = (Number)(stringUser);
        return true;
      }
    } else {
      return true;
    }
  }


  login(body: String): Observable<HttpResponse<Object>> {

    const url = 'http://localhost:8080/basic-shop/rest/log/in';
    const req = this.http.post<HttpResponse<Object>>(
      url, body, {withCredentials: true, headers: this.httpOptions.headers, observe: 'response'});
    return req;
  }

// -----------------------------------------------------------------
// ----- da qui in poi i metodi si assicurano la presenza di userID tramite l'inizializzazione _init()

  logout(): Observable<HttpResponse<Object>> {
    if (!this._init()) {
      return null;
    }
    const url = 'http://localhost:8080/basic-shop/rest/log/out/' + this.userID;
    this.userID = null;
    const req = this.http.delete<HttpResponse<Object>>(
      url, {headers: this.httpOptions.headers, observe: 'response'});
    return req;
  }

  getUser(): Observable<HttpResponse<User>> {
    if (!this._init()) {
      return null;
    }
    const url = 'http://localhost:8080/basic-shop/rest/user/get/' + this.userID;
    const req = this.http.get<User>(
      url, {observe: 'response', headers: this.httpOptions.headers});
    return req;
  }

  updateUser(body: string): Observable<HttpResponse<Object>> {
    if (!this._init()) {
      return null;
    }
    const url = 'http://localhost:8080/basic-shop/rest/user/update/' + this.userID;
    console.log('updating remote user');
    const req = this.http.put<Object>(
      url, body, {observe: 'response', headers: this.httpOptions.headers});
    return req;
  }

// --------------------------- fine metodi con init() ----------------------------------


  // da qui sono definiti servizi relativi a info-form
  // quindi non sono metodi che usano Http, rimangono interni al client
  // forniscono, aggiornano e persistono su storage locale l'utente

  getUserInfo(): User {
  // prova a ripristinare l'utente da localStorage, nel caso non ce ne sia uno, lo richiede al server
  const stringUser = this.localStorageService.loadUser();
  if (isNullOrUndefined(stringUser)) {
    this.getUser().subscribe(
      (resp) => {
        this.user = resp.body;
      }
    );
  } else {
    this.user = JSON.parse(stringUser);
  }
  return this.user;
}

  updateConversation(stringUser: string) {
    // se c'è un utente sul localStorage lo elimina e lo sostituisce con quello nuovo, sennò semplicemnte salva il nuovo
    this.user = JSON.parse(stringUser);
    if (!isNullOrUndefined(this.localStorageService.loadUser())) {
      this.localStorageService.deleteUser();
    }
    this.localStorageService.registerUser(stringUser);

  }

  endConversation(): void {
    // elimina lo stato relativo all'inserimento dati utente dal localStorage
    this.localStorageService.deleteUser();
  }



}

