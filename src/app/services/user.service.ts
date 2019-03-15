import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isUndefined, isNullOrUndefined } from 'util';
import { LocalStorageService } from './local/local.storage.service';
import { User } from '../model/User';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private cid: Number;
  private conversationActive = false;
  public userID: Number;



  public setCid(newCid: Number) {
    this.cid = newCid;
  }

  public getCid(): Number {
    return this.cid;
  }

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
    ) {}

    /*****************************************************************************
      gli errori nelle response non vengono gestiti - per semplicità

      XMLHttpRequest.withCredentials Is a Boolean that indicates whether or not
      cross-site Access-Control requests should be made using credentials such
      as cookies or authorization headers. The default is false.

      [observe: 'response']  serve per leggere tutta la risposta http
    ******************************************************************************/


  login(body: String): Observable<HttpResponse<Object>> {
    const url = 'http://localhost:8080/basic-shop/rest/log/in';
    const req = this.http.post<HttpResponse<Object>>(
      url, body, {withCredentials: true, headers: this.httpOptions.headers, observe: 'response'});
    return req;
  }

  logout(): Observable<HttpResponse<Object>> {
    this.cid = null;
    const url = 'http://localhost:8080/basic-shop/rest/log/out/' + this.userID;
    this.userID = null;
    const req = this.http.delete<HttpResponse<Object>>(
      url, {headers: this.httpOptions.headers, observe: 'response'});
    return req;
  }

  getUser(): Observable<HttpResponse<User>> {  // così funziona uguale la sessione ?
    const url = 'http://localhost:8080/basic-shop/rest/user/get' + this.userID;
    const req = this.http.get<User>(
      url, {observe: 'response', headers: this.httpOptions.headers});
    return req;
  }



}

