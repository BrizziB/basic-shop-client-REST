import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isUndefined, isNullOrUndefined } from 'util';
import { LocalStorageService } from './local/local.storage.service';
import { Order } from '../model/Order';
import { UserService } from '../services/user.service';


@Injectable({
  providedIn: 'root'
})
export class OrderService{

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
    /*****************************************************************************
      gli errori nelle response non vengono gestiti - per semplicità

      nei metodi che richiedono lo userID, ho fatto in modo che lo richiamino da userService
      questo comporta che prima richiamino una funzione di inizializione di userService
      tale funzione inizializza nuovamente l'attributo userID in caso sia avvenuto un refresh
      nel caso non sia presente alcun userID nel localStorage si viene reindirizzati al login

    ******************************************************************************/
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private localStorageService: LocalStorageService
    ) {}



    getOrderStateless(): Observable<HttpResponse<Order>> {
      if (!this.userService._init()) {
        return null;
      }
      const url = 'http://localhost:8080/basic-shop/rest/order/get/' + this.userService.userID;
      const req = this.http.get<Order>(
        url, {withCredentials: true, headers: this.httpOptions.headers, observe: 'response'});
      return req;
    }

    removeProductFromOrderStateless(body: String): Observable<HttpResponse<Boolean>> {
      if (!this.userService._init()) {
        return null;
      }
      const url = 'http://localhost:8080/basic-shop/rest/order/remove/' + this.userService.userID;
      const req = this.http.put<Boolean>(
        url, body, {withCredentials: true, headers: this.httpOptions.headers, observe: 'response'});
      return req;
    }

    addProductToOrderStateless(body: String): Observable<HttpResponse<Boolean>> {
      if (!this.userService._init()) {
        return null;
      }
      const url = 'http://localhost:8080/basic-shop/rest/order/add/' + this.userService.userID;
      const req = this.http.put<Boolean>(
        url, body, {withCredentials: true, headers: this.httpOptions.headers, observe: 'response'});
      return req;
    }

    completeOrderStateless(): Observable<HttpResponse<Boolean>> {
      if (!this.userService._init()) {
        return null;
      }
      const url = 'http://localhost:8080/basic-shop/rest/order/complete/' + this.userService.userID;
      const req = this.http.put<Boolean>(
        url, null, {withCredentials: true, headers: this.httpOptions.headers, observe: 'response'});
      return req;
    }

}

