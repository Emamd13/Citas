import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  private headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');
  private urlEndPoint: string = 'http://10.212.0.196:8081/Citas/Citas/tramite/';
  constructor(private http: HttpClient, private router: Router) { }
 
  getRegiones(): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
        'Allow': ' GET, POST, OPTIONS, PUT, DELETE'
      })
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Allow': ' GET, POST, OPTIONS, PUT, DELETE'
     
    });

    
    console.log("entraaa..." + headers);
    return this.http.post<any[]>(this.urlEndPoint+ "getall", JSON.stringify(""), httpOptions);
   


    
       
  }

  public save(): Observable<any> {
    return this.http.post<any>(this.urlEndPoint + 'getall', "");
  }
  

}


