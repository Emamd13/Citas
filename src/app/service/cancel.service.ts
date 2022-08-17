import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})


export class CancelService {
  private urlEndPoint: string = 'http://10.212.0.196:8081/Citas/Citas/tramite/';
  //private urlEndPoint: string = 'http://localhost:8084/Citas/Citas/tramite/';
  constructor(private http: HttpClient, private router: Router) { }

  search(clave: any, correo: any) {
    let json = {
      clave: clave,
      correo: correo
    };
    console.log(json);
    return this.http.post(this.urlEndPoint + "CitaByClaves", json).pipe(map((response: any) => response));
  }

  cancel(clave: any, tramite: any,correo: any) {

    let json = {
      clave: clave,
      tramite: tramite,
      correo: correo
    }
    console.log(json);
    return this.http.post(this.urlEndPoint + "EliminarCita", json).pipe(map((response: any) => response));


  }


  dateFormat(inputDate: any, format: any) {
    //parse the input date
    const date = new Date(inputDate);

    //extract the parts of the date
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    //replace the month
    format = format.replace("MM", month.toString().padStart(2, "0"));

    //replace the year
    if (format.indexOf("yyyy") > -1) {
      format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
      format = format.replace("yy", year.toString().substr(2, 2));
    }

    //replace the day
    format = format.replace("dd", day.toString().padStart(2, "0"));

    return format;
  }
}