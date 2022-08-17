import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CatalogosService {




  private headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('dataType', 'json')



  private urlEndPoint: string = 'http://10.212.0.196:8081/Citas/Citas/tramite/';
 // private urlEndPoint: string = 'http://localhost:8084/Citas/Citas/tramite/';
  constructor(private http: HttpClient, private router: Router) { }

  getRegiones() {
    console.log("antes del post");

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
        'Allow': ' GET, POST, OPTIONS, PUT, DELETE'
      })
    };

    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    let params = new URLSearchParams();
    console.log("antes del post");


    /*this.http.get(this.urlEndPoint+ "getallTramites").subscribe(
     (data) => {
         console.log(data);
     },
     (err: HttpErrorResponse) => {
         if (err.error instanceof Error) {
             console.log('Client-side error occured.');
         } else {
             console.log('Server-side error occured.');
         }
     }
 );*/

    //this.http.get(this.urlEndPoint+ "getallTramites",  {'headers': this.headers});
    return this.http.get(this.urlEndPoint + "getallTramites").pipe(map((response: any) => response));
   //return this.http.post(this.urlEndPoint + "getall",'').pipe(map((response: any) => response));




  }

  getRequerimientos(element: any) {
    let id = element.target.value.split('.')[1];
    let service = element.target.value.split('.')[0];

    return this.http.post(this.urlEndPoint + "obtenertramitebyid", { id: id }).pipe(map((response: any) => response));
  }
  public save(): Observable<any> {
    return this.http.post<any>(this.urlEndPoint + 'getall', "");
  }


  validation(json: any) {

    return this.http.post(this.urlEndPoint + "validar", json).pipe(map((response: any) => response));

  }


  validationCurp(json: any) {
    console.log("Curp");
    return this.http.post(this.urlEndPoint + "validarcurpc", json).pipe(map((response: any) => response));

  }


  delegacionesById(json: any) {
    console.log("Curp");
    return this.http.post(this.urlEndPoint + "obtenerdelegacionesbyid", json).pipe(map((response: any) => response));

  }
}


