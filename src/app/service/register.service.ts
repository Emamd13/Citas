import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private urlEndPoint: string = 'http://10.212.0.196:8081/Citas/Citas/tramite/';
  //private urlEndPoint: string = 'http://localhost:8084/Citas/Citas/tramite/';
  constructor(private http: HttpClient, private router: Router) { }

  getDomicile(id: any) {
    let json = { id: id };
    return this.http.post(this.urlEndPoint + "obtenerdirecionbyid", json).pipe(map((response: any) => response));
  }


  getDates(json: any, delegacion: any) {
    json["delegacion"] = delegacion;
    return this.http.post(this.urlEndPoint + "obtenerFechasCitas", json).pipe(map((response: any) => response));
  }
  getHours(json: any, idDelegacion: any, fecha: any) {
    json["delegacion"] = idDelegacion;
    json["fecha"] = fecha;
    return this.http.post(this.urlEndPoint + "obtenerhorarios", json).pipe(map((response: any) => response));
  }

  insertCita(json: any, delegacionName: any, idDelegacion: any, fecha: any, idhorario: any, horario: any, domicilio: any, form:any) {
    console.log(fecha);


    console.log(new Date(fecha).getDate() );
    let formatted_date =  (new Date(fecha).getDate() + 1 )+ "-" + (new Date(fecha).getMonth() + 1) + "-" + new Date(fecha).getFullYear()
    let fechanueva = this.convertDateFormat(fecha);
    console.log(fechanueva);


    json["delegacion-text"] = delegacionName;
    json["domicilio"] = domicilio;
    json["fechaantigua"] = fechanueva;
    json["fecha"] = fecha;
    json["idhorario"] = idhorario.toString();
    json["horario"] = horario;
    json["delagacion"] = idDelegacion.toString();

    console.log(json);
    console.log(delegacionName);
    let datos = json;

    if(json.foliopago=="-"){
      datos["foliopago"]="";
    }
    datos["tramite"] = datos.tramiteS;
    datos["nombre"]    = form.value.name;
    datos["apellidos"]    = form.value.lastName;
    datos["telefono-fijo"]    = form.value.phone;
    datos["telefono"]    = form.value.cellPhone;
    datos["correo"]    = form.value.mail;
    datos["correo-con"]    = form.value.mailCon;

    return this.http.post(this.urlEndPoint + "insertarCita", datos).pipe(map((response: any) => response));

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


  convertDateFormat(string:any) {
    var info = string.split('-');
    return info[2] + '-' + info[1] + '-' + info[0];
  }

   formatDate(date:any) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('-');
}
 
}