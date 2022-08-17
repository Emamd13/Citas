import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NgxSpinnerService } from "ngx-spinner";
import { MatListOption } from '@angular/material/list';
import { RegisterService } from 'src/app/service/register.service';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import frLocale from '@fullcalendar/core/locales/fr';
import * as moment from 'moment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { merge, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  Events: any[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    selectable: true,
    locales: [esLocale, frLocale],
    locale: 'es',
    dateClick: this.handleDateClick.bind(this)
  };
  @ViewChild('modalView', { static: true }) modalView$: ElementRef;

  ///@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  closeResult: string = '';
  src: string;
  etiqueta: string;
  user: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  formularioDatos: boolean;
  JsonCurp: any;
  delegaciones: any = [];
  idDelegacion: any;
  delegacionName: any;
  selectedOptions: any;
  datesArray: any = [];
  hours: any = [];
  hoursBoolean: boolean;
  confirma: boolean = false;
  lowValue: number = 0;
  highValue: number = 50;
  dateU: any;
  pageEvent: PageEvent;
  hora: any;
  horaName: any;
  pageIndex: number = 0;
  pageSize: number = 10;
  length: number;
  isDisabled: boolean;
  fechaTitulo: string;
  public numberRegEx = /^[0-9]\d*$/;
  pdfSrc: string;
  private map: any;
  public icon: any;
  showMap: boolean;
  ///dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  displayedColumns: string[] = ['hrrio', 'disponible'];
  dataSources = new MatTableDataSource<Horarios>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  selectedRowIndex = -1;
  ngAfterViewInit() {

  }

  constructor(private _formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    private registerService: RegisterService, private router: Router, public modal: NgxSmartModalService, public dialog: MatDialog,
    private modalService: NgbModal) {
    this.formularioDatos = false;
    this.hoursBoolean = false;
    this.isDisabled = true;
    this.showMap = false;
    this.icon = {
      icon: L.icon({
        iconSize: [25, 41],
        iconAnchor: [13, 0],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    };

  }


  getRecord(row: any) {
    this.selectedRowIndex = row.idHrrio;
    console.log(row);

    this.hora = row.idHrrio;
    this.horaName = row.hrrio;
    if (this.selectedRowIndex != -1) {
      this.isDisabled = false;
    }

  }
  ngOnInit(): void {
    const fecha = new Date();

  //  let formatted_date =  fecha.getDate()  + "-" + (fecha.getMonth() + 1) + "-" + fecha.getFullYear()
    //let fechanueva = formatted_date;
    let fechanueva =  fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate()
this.fechaTitulo = fechanueva;
    //  this.dataSources.paginator = this.paginator;
    this.JsonCurp = sessionStorage.getItem('mapCurp');
    let JsonDe = JSON.parse(sessionStorage.getItem('delegaciones') || '{}');
    this.selectedOptions = JsonDe[0];
    console.log(sessionStorage.getItem('delegaciones'));
    this.idDelegacion = JsonDe[0].iddelegacion;

    this.delegacionName = JsonDe[0].delegacion;


    /*this.registerService.getDomicile(this.idDelegacion.toString()).subscribe(response => {
      this.src = 'data:image/png;base64,' + this.arrayBufferToBase64(response.data.dlgcionMpa);
      this.etiqueta = response.data.etqtaDlgDmclio;
     // this.spinner.show();
      if (response.data != null) {
        this.getDates();

      }

    })*/




    this.delegaciones = JsonDe;
    console.log(this.delegaciones);
    console.log(sessionStorage.getItem('mapCurp'));
    let curp = JSON.parse(this.JsonCurp);
    console.log(JSON.parse(this.JsonCurp));

    this.registerService.getDomicile(this.idDelegacion.toString()).subscribe(response => {
      console.log(response);

      this.src = 'data:image/png;base64,' + this.arrayBufferToBase64(response.data.dlgcionMpa);
      this.etiqueta = response.data.etqtaDlgDmclio;
      console.log(this.src);
      this.map = L.map('map', {
        center: [response.data.latitud, response.data.longitud],
        zoom: 16
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 20,
        minZoom: 3,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      const lat = response.data.latitud;
      const lon = response.data.longitud;
      let makerLocation = undefined;
      makerLocation = new L.LatLng(lat, lon);

      const marker = new L.Marker(makerLocation, this.icon);

      this.map.addLayer(marker);
      this.map.invalidateSize();

      marker.bindPopup("<p>" + this.etiqueta + "</p>");
      if (response.data != null) {
        this.getDates();
        this.getHour();
        /*   this.calendarOptions = {
             initialView: 'dayGridMonth',
             selectable: true,
             locales: [esLocale, frLocale],
             locale: 'es',
             dateClick: this.handleDateClick.bind(this),
             events: [
   
             ]
             };*/

      }
    })


    this.firstFormGroup = this._formBuilder.group({
      name: [curp.nombre, Validators.required],
      lastName: [curp.apellidoPaterno + ' ' + curp.apellidoMaterno, Validators.required],
      cellPhone: ['', Validators.required], //, Validators.maxLength(10), Validators.pattern(this.numberRegEx)
      mail: ['', [Validators.required, Validators.email]],
      mailCon: ['', [Validators.required, Validators.email]],
      phone: [''],
      /// phone: new FormControl('')

      /*   name: new FormControl(curp.nombre, Validators.required),
           lastName: new FormControl(curp.apellidoPaterno + ' ' + curp.apellidoMaterno, Validators.required),
     
           phone: new FormControl('', Validators.required),
           cellPhone: new FormControl('', Validators.required),
           mail: new FormControl('', Validators.required),
           mailCon: new FormControl('', Validators.required),*/
    });




  }
  selectionChange(option: MatListOption) {
    this.spinner.show();
    this.map.remove();

    this.idDelegacion = option.value.iddelegacion.toString();
    this.delegacionName = option.value.delegacion;


    this.registerService.getDomicile(option.value.iddelegacion.toString()).subscribe(response => {
      this.src = 'data:image/png;base64,' + this.arrayBufferToBase64(response.data.dlgcionMpa);
      this.etiqueta = response.data.etqtaDlgDmclio;


      if (response.data != null) {
        this.getDates();
        this.selectedRowIndex = -1;
        this.calendarOptions = {};
        this.map = L.map('map', {
          center: [response.data.latitud, response.data.longitud],
          zoom: 16
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 20,
          minZoom: 3,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        const lat = response.data.latitud;
        const lon = response.data.longitud;
        let makerLocation = undefined;
        makerLocation = new L.LatLng(lat, lon);

        const marker = new L.Marker(makerLocation, this.icon);

        this.map.addLayer(marker);
        this.map.invalidateSize();
        marker.bindPopup("<p>" + this.etiqueta + "</p>");
      }

    })

    console.log(option.value.iddelegacion);
  }

  getDates() {
    this.isDisabled = true;
    let JsonDe = JSON.parse(sessionStorage.getItem("datosTyS") || '{}');
    console.log(JsonDe);

    this.registerService.getDates(JsonDe, this.idDelegacion.toString()).subscribe(response => {
      console.log(response);
      let arreglo = [];

      for (let i = 0; i < response.data.length; i++) {
        this.datesArray[i] = response.data[i].fecha;
        if (response.data[i].disponible == 1) {
          arreglo[i] = {
            start: response.data[i].fecha,
            end: response.data[i].fecha,
            display: 'background',
          };
        } else if (response.data[i].disponible == 0) {
          arreglo[i] = {
            start: response.data[i].fecha,
            end: response.data[i].fecha,
            display: 'background',
            color: '#FF0000'
          };
        }



      }
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        selectable: true,
        locales: [esLocale, frLocale],
        locale: 'es',
        dateClick: this.handleDateClick.bind(this),
        events: arreglo,
        eventColor: '#007717'
      };


      this.spinner.hide();
    })


  }
  arrayBufferToBase64(buffer: any) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }


  getHourR() {
    let idDelegacion = this.idDelegacion.toString();
    const fecha = this.dateU;
    console.log(fecha);

    //let formatted_date = new Date(fecha).getDate()  + "-" + (new Date(fecha).getMonth() + 1) + "-" + new Date(fecha).getFullYear()
   // let fechanueva = formatted_date;
     let fechanueva = this.dateFormat(fecha, "yyyy-MM-dd");
  //  console.log(fechanueva.toString());
    let obj = JSON.parse(sessionStorage.getItem("datosTyS") || '{}');
    this.registerService.getHours(obj, idDelegacion, fecha.toString()).subscribe(response => {

      this.hours = response.data;
      this.dataSources = new MatTableDataSource(response.data);
      this.dataSources.paginator = this.paginator;
      this.selectedRowIndex = -1;
      //this.length = response.data.length;

      console.log(response);
    })

    this.hoursBoolean = true;
  }


  getHour() {
    let idDelegacion = this.idDelegacion.toString();
    const fecha = new Date();
    console.log(fecha);

   // let formatted_date =  new Date(fecha).getDate()  + "-" + (new Date(fecha).getMonth() + 1) + "-" + new Date(fecha).getFullYear()
    //let fechanueva = formatted_date;

    let fechanueva = this.dateFormat(fecha, "yyyy-MM-dd");
    console.log(fechanueva.toString());
    let obj = JSON.parse(sessionStorage.getItem("datosTyS") || '{}');
    this.registerService.getHours(obj, idDelegacion, fechanueva.toString()).subscribe(response => {

      this.hours = response.data;
      this.dataSources = new MatTableDataSource(response.data);
      this.dataSources.paginator = this.paginator;
      this.selectedRowIndex = -1;
      //this.length = response.data.length;

      console.log(response);
    })

    this.hoursBoolean = true;
  }




  handleDateClick(arg: any) {
    //  alert('date click! ' + arg.dateStr)
    this.dateU = arg.dateStr;

   // let fechanueva = this.dateFormat(arg.dateStr, "dd-MM-yyyy");
    let formatted_date =  new Date(arg.dateStr).getDate()  + "-" + (new Date(arg.dateStr).getMonth() + 1) + "-" + new Date(arg.dateStr).getFullYear()
    let fechanueva = formatted_date;
    this.fechaTitulo = arg.dateStr;
    console.log(this.dateU);
    this.isDisabled = true;
    let dateSuccess = false;
    for (let i = 0; i < this.datesArray.length; i++) {
      if (this.datesArray[i] == arg.dateStr) {
        dateSuccess = true;

      }
    }

    if (dateSuccess) {
      let idDelegacion = this.idDelegacion.toString();

      let obj = JSON.parse(sessionStorage.getItem("datosTyS") || '{}');
      this.hours = {};

      if (obj != null) {
        this.registerService.getHours(obj, idDelegacion, arg.dateStr).subscribe(response => {

          this.hours = response.data;
          this.dataSources = new MatTableDataSource(response.data);
          this.dataSources.paginator = this.paginator;
          this.selectedRowIndex = -1;
          //this.length = response.data.length;

          console.log(response);
        })
      }

      this.hoursBoolean = true;

    } else {
      this.hours = [];
      this.dataSources = new MatTableDataSource;
      console.log("no existe ");
    }
  }


  selectionHourChange(option: MatListOption) {
    console.log(option.value);
  }


  getPaginatorData(event: any) {
    console.log(event);
    if (event.pageIndex === this.pageIndex + 1) {
      this.lowValue = this.lowValue + 10;
      this.highValue = this.highValue + 10;
    }
    else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - 10;
      this.highValue = this.highValue - 10;
    }
    this.pageIndex = event.pageIndex;
  }
  onKeyMail(event: any) {
    console.log(event.target.value);
    if (this.firstFormGroup.value.mail == event.target.value) {
      this.confirma = false;
      return true;
    } else {
      this.confirma = true;
      return false;
    }

  }

  insertCita(content: any) {
    try {



      let obj = JSON.parse(sessionStorage.getItem("datosTyS") || '{}');
      this.spinner.show();
      this.registerService.insertCita(obj, this.delegacionName, this.idDelegacion, this.dateU, this.hora, this.horaName, this.etiqueta, this.firstFormGroup).subscribe(response => {
        if (response.pdf != null) {

          /*   const dialogConfig = new MatDialogConfig();
             dialogConfig.disableClose = true;
             dialogConfig.autoFocus = true;*/
          this.pdfSrc = 'data:image/pdf;base64,' + this.arrayBufferToBase64(response.pdf);
          //    this.dialog.open(DialogContentExampleDialog, dialogConfig);
          this.spinner.hide();
       
            //const dialogConfig = new MatDialogConfig();
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop  : 'static',
        keyboard  : false }).result.then((result) => {
         
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
        
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        console.log(response);
          // this.router.navigate(['/']);
          //   this.modal.getModal("homeModal").open();

          // this.modalView$.nativeElement.classList.add('visible');
        } else {
          console.log("Entra por que ya hay una citaa..");
          this.getHourR();
          this.getDates();
          this.spinner.hide();
          Swal.fire({
            icon: 'error',
            title: 'Ocurrio un error al registrar su cita',
            text: response.mensaje,
    
          })
        }
      
      })
    } catch (error) {
      console.log("try");
      Swal.fire({
        icon: 'error',
        title: 'Ocurrio un error al registrar su cita',
        text: 'vuelva a intentarlo',

      })
      this.getHourR();
      this.getDates();
      this.spinner.hide();
    

    }
  }
close(){

  window.location.reload();
}
 
  dayRender(dayRenderInfo: any) {
    let dateMoment = moment(dayRenderInfo.date);
    console.log(dateMoment);
    if (dateMoment.day() === 6 || dateMoment.day() === 0) {
      console.log("if-----");
      dayRenderInfo.el.style.backgroundColor = '#d6e7e1';
    }
    else {
      console.log("if-----");
      dayRenderInfo.el.style.backgroundColor = 'white';
    }
    return dayRenderInfo;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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


export interface Horarios {
  idHrrio: number;
  hrrio: string;
  disponible: number;

}

@Component({
  selector: 'dialog',
  templateUrl: 'dialog.component.html',
})
export class DialogComponent {

}


