import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { CatalogosService } from '../service/catalogos.service';
import { Observable, throwError } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  tranitesOptions: Observable<any>;
  public tramites: any;
  public value: any;
  public NoSerie: boolean;
  public NoPlaca: boolean;
  public folio: boolean;
  public serie: boolean;
  public todo: boolean = false;
  urlTree: any;
  token: string | undefined;
  isDisableButton: boolean = true;
  ///////////Formulario/////////////
  plate = new FormControl('', [Validators.required]);
  vin = new FormControl('', [Validators.required]);
  paymentFolio = new FormControl('', [Validators.required]);
  paymentVin = new FormControl('', [Validators.required]);
  CURP = new FormControl('', [Validators.required]);
  tramiteGlobal: any;
  ServicioGlobal: any;
  recaptchaC: boolean = false;
  registersForm: boolean = false;
  delegacionTexto: string;
  readonly: boolean = false;
  tramiteGet: any;
  @ViewChild('recaptchas') captchaRef2: ElementRef;
  constructor(private catalogoService: CatalogosService, private spinner: NgxSpinnerService, private router: Router) {
    this.token = undefined;
  }
  ngOnInit(): void {
    let variable = "";
    this.urlTree = this.router.parseUrl(this.router.url);

    this.tramiteGet = this.urlTree.queryParams['tramite'];



    //sessionStorage.clear();

    this.catalogoService.getTramites().subscribe(response => {

      this.tranitesOptions = response.data;

      this.tramites = response.data;
      for (var i = 0; i < response.data.length; i++) {

        if (this.tramiteGet != null || this.tramiteGet != "" || this.tramiteGet != undefined) {


          if (this.tramiteGet == response.data[i].idTrmte.split('.')[1]) {
            this.getValueGet(response.data[i].idTrmte);
          }
        }
      }



    });
  }


  getResponceCapcha() {
    this.isDisableButton = true;
  }

  send(form: NgForm): void {
  
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    } else {
      this.spinner.show();
      try {
        let datos = {
          "No. Placa": this.plate.value,
          "No. Serie": this.vin.value,
          "curp": this.CURP.value,
          "folio": this.paymentFolio.value.toString(),
          "serie": this.paymentVin.value,
          "seriefolio": this.paymentVin.value + "-" + this.paymentFolio.value.toString(),
          "foliopago": this.paymentVin.value + "-" + this.paymentFolio.value.toString(),
          "servicio": this.ServicioGlobal,
          "tramite": this.tramiteGlobal,
          "tramiteS": this.delegacionTexto,
          "idtramite": this.tramiteGlobal,
          "idservicio": this.ServicioGlobal

        };
        sessionStorage.setItem("datosTyS", JSON.stringify(datos));


      
        /////////Particular//////
        if (this.ServicioGlobal == 1) {
          if (this.tramiteGlobal == 3) {

            if ((this.paymentFolio.value.toString() != "" && this.paymentFolio.value.toString().length <= 8) && (this.paymentVin.value != "" && this.paymentVin.value.toString().length == 1) && this.CURP.value != "") {

              let json = {
                "No. Placa": this.plate.value,

                "curp": this.CURP.value,
                "folio": this.paymentFolio.value.toString(),
                "serie": this.paymentVin.value,
                "seriefolio": this.paymentVin.value + "-" + this.paymentFolio.value.toString(),
                "servicio": this.ServicioGlobal,
                "tramites": this.tramiteGlobal
              };

              try {
                this.catalogoService.validationCurp(json).subscribe(response => {
                

                  if (response.curp) {



                    sessionStorage.setItem('mapCurp', JSON.stringify(response.curp.map));

                    this.catalogoService.delegacionesById(json).subscribe(response => {

                      if (response.data != null) {
                        sessionStorage.setItem('delegaciones', JSON.stringify(response.data))
                        this.spinner.hide();
                        this.token = undefined;
                        this.recaptchaC = false;
                        this.registersForm = true;
                        this.readonly = true;
                      }
                    });
                  } else {
                    this.spinner.hide();
                    Swal.fire({
                      icon: 'error',
                      title: response.menseje,
                      text: 'vuelva a intentarlo',

                    })
                  }


                });

              }
              catch (error) {
                this.spinner.hide();
                Swal.fire({
                  icon: 'error',
                  title: 'Ocurrio un error',
                  text: 'vuelva a intentarlo',

                })
              }

            } else {
              this.spinner.hide();
              Swal.fire({
                icon: 'error',
                title: 'Error en los datos del formulario',
                text: 'Verifique los datos colocados que sean correctos',

              })
            }
          } else if (this.tramiteGlobal == 1) {
            if (this.plate.value != "" && this.vin.value != "" && this.CURP.value != "") {

              let json = {
                "No. Placa": this.plate.value,
                "No. Serie": this.vin.value,
                "curp": this.CURP.value,

                "servicio": this.ServicioGlobal,
                "tramites": this.tramiteGlobal
              };

              this.catalogoService.validation(json).subscribe(response => {


                if (response.data) {
                  sessionStorage.setItem('mapCurp', JSON.stringify(response.curp.map))



                  this.catalogoService.delegacionesById(json).subscribe(response => {

                    if (response.data != null) {

                      sessionStorage.setItem('delegaciones', JSON.stringify(response.data))
                      this.spinner.hide();
                      this.token = undefined;
                      this.recaptchaC = false;
                      this.registersForm = true;
                      this.readonly = true;
                    }
                  });


                } else {
                  this.spinner.hide();
                  Swal.fire({
                    icon: 'error',
                    title: response.menseje,
                    text: 'vuelva a intentarlo',

                  })
                }


              });
            } else {
              this.spinner.hide();
              Swal.fire({
                icon: 'error',
                title: 'Error en los campos del formulario',
                text: 'Verifique que los campos estén correctamente llenos',

              })

            }
          } else {
            if (this.plate.value != "" && this.vin.value != "" && (this.paymentFolio.value.toString() != "" && this.paymentFolio.value.toString().length <= 8) && (this.paymentVin.value != "" && this.paymentVin.value.toString().length == 1) && this.CURP.value != "") {

              let json = {
                "No. Placa": this.plate.value,
                "No. Serie": this.vin.value,
                "curp": this.CURP.value,
                "folio": this.paymentFolio.value.toString(),
                "serie": this.paymentVin.value,
                "seriefolio": this.paymentVin.value + "-" + this.paymentFolio.value.toString(),
                "servicio": this.ServicioGlobal,
                "tramites": this.tramiteGlobal
              };

              this.catalogoService.validation(json).subscribe(response => {


                if (response.data) {
                  sessionStorage.setItem('mapCurp', JSON.stringify(response.curp.map))



                  this.catalogoService.delegacionesById(json).subscribe(response => {

                    if (response.data != null) {

                      sessionStorage.setItem('delegaciones', JSON.stringify(response.data))
                      this.spinner.hide();
                      this.token = undefined;
                      this.recaptchaC = false;
                      this.registersForm = true;
                      this.readonly = true;
                    }
                  });


                } else {
                  this.spinner.hide();
                  Swal.fire({
                    icon: 'error',
                    title: response.menseje,
                    text: 'vuelva a intentarlo',

                  })
                }


              });
            } else {
              this.spinner.hide();
              Swal.fire({
                icon: 'error',
                title: 'Error en los campos del formulario',
                text: 'Verifique que los campos estén correctamente llenos',

              })

            }
          }
          /////////Público//////
        } else if (this.ServicioGlobal == 2) {

          if (this.plate.value != "" && this.CURP.value != "") {
            let json = {
              "No. Placa": this.plate.value,

              "curp": this.CURP.value,

              "seriefolio": this.paymentVin.value + "-" + this.paymentFolio.value.toString(),
              "servicio": this.ServicioGlobal,
              "tramites": this.tramiteGlobal
            };
            this.catalogoService.validation(json).subscribe(response => {

              if (response.data) {




                this.catalogoService.delegacionesById(json).subscribe(response => {
                  if (response.data != null) {

                    sessionStorage.setItem('delegaciones', JSON.stringify(response.data))
                    this.spinner.hide();
                    this.token = undefined;
                    this.recaptchaC = false;
                    this.registersForm = true;
                    this.readonly = true;
                  }
                });
              } else {

                this.spinner.hide();
                Swal.fire({
                  icon: 'error',
                  title: 'Error en los campos del formulario',
                  text: response.menseje,

                })
              }


            });
          } else {

            this.spinner.hide();
            Swal.fire({
              icon: 'error',
              title: 'Error en los campos del formulario',
              text: 'Verifique que los campos estén correctamente llenos',

            })
          }




          /////////Licencias//////
        } else {


          if ((this.paymentFolio.value.toString() != "" && this.paymentFolio.value.toString().length <= 8) && (this.paymentVin.value != "" && this.paymentVin.value.toString().length == 1) && this.CURP.value != "") {
            let json = {
              "No. Placa": this.plate.value,

              "curp": this.CURP.value,
              "folio": this.paymentFolio.value.toString(),
              "serie": this.paymentVin.value,
              "seriefolio": this.paymentVin.value + "-" + this.paymentFolio.value.toString(),
              "servicio": this.ServicioGlobal,
              "tramites": this.tramiteGlobal
            };


            this.catalogoService.validationCurp(json).subscribe(response => {


            
              if (response != null) {
                if (response.curp || response.curp != null) {



                  sessionStorage.setItem('mapCurp', JSON.stringify(response.curp.map));

                  this.catalogoService.delegacionesById(json).subscribe(response => {

                    if (response.data != null) {
                      sessionStorage.setItem('delegaciones', JSON.stringify(response.data))
                      this.spinner.hide();
                      this.token = undefined;
                      this.recaptchaC = false;
                      this.registersForm = true;
                      this.readonly = true;
                    }
                  });
                } else {
                  this.spinner.hide();
                  Swal.fire({
                    icon: 'error',
                    title: response.menseje,
                    text: 'vuelva a intentarlo',

                  })
                }

              }else{
                this.spinner.hide();

            Swal.fire({
              icon: 'error',
              title: 'Error en los campos del formulario',
              text: 'Verifique que los campos estén correctamente llenos',

            })
              }



            });
          } else {
            this.spinner.hide();

            Swal.fire({
              icon: 'error',
              title: 'Error en los campos del formulario',
              text: 'Verifique que los campos estén correctamente llenos',

            })
          }






        }
      } catch (error) {
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          title: 'Ocurrio un error',
          text: 'vuelva a intentarlo',

        })
      }
    }


  }

  resolved(captchaResponse: string) {

  }
  getValueGet(value: any) {
    this.plate = new FormControl('', [Validators.required]);
    this.vin = new FormControl('', [Validators.required]);
    this.paymentFolio = new FormControl('', [Validators.required, Validators.maxLength(8)]);
    this.paymentVin = new FormControl('', [Validators.required, Validators.maxLength(1), Validators.pattern("[A-Za-z]")]);
    this.CURP = new FormControl('', [Validators.required]);



    if (value != 0) {
      this.todo = true;
      this.recaptchaC = true;
      this.catalogoService.getRequerimientosGet(value).subscribe(response => {




        let service = value.split('.')[0];
        let tramite = value.split('.')[1];
        this.tramiteGlobal = tramite;
        this.ServicioGlobal = service;

        for (let i = 0; i < this.tramites.length; i++) {

          if (this.tramites[i].idTrmte.split('.')[1] == this.tramiteGlobal) {
            this.delegacionTexto = this.tramites[i].tramite;


          }
        }


        if (response.data.regla1 == "No. Placa") {

          if (tramite == 3) {

            this.NoPlaca = false;
          } else {
            this.NoPlaca = true;


          }

          /* if (tramite == 1) {
             console.log("1 tramite");
             this.NoPlaca = true;
             this.NoSerie = true;
             this.folio = false;
             this.serie = false;
             console.log(  this.folio);
             console.log(  this.serie);
           }*/





        } else {
          this.NoPlaca = false;

        }

        if (response.data.regla2 == "No. Serie" && service != 2) {


          if (tramite == 3) {
            this.NoSerie = false;
          } else {
            this.NoSerie = true;
          }

          if (tramite == 1) {
            this.serie = false;
            this.folio = false;
          } else {
            this.serie = true;
            this.folio = true;
          }
        } else {

          this.NoSerie = false;
        }


        if (service == 2) {

          this.serie = false;
          this.folio = false;
          //   this.NoSerie = false;
        } else if (service != 2 && tramite != 1) {

          this.serie = true;
          this.folio = true;
        }



      })
    } else {
      this.plate = new FormControl('', [Validators.required]);
      this.vin = new FormControl('', [Validators.required]);
      this.paymentFolio = new FormControl('', [Validators.required, Validators.maxLength(8)]);
      this.paymentVin = new FormControl('', [Validators.required, Validators.maxLength(1), Validators.pattern("[A-Za-z]")]);
      this.CURP = new FormControl('', [Validators.required]);

      this.todo = false;
      this.recaptchaC = false;
    }

  }
  getValue(value: any) {

    this.plate = new FormControl('', [Validators.required]);
    this.vin = new FormControl('', [Validators.required]);
    this.paymentFolio = new FormControl('', [Validators.required, Validators.maxLength(8)]);
    this.paymentVin = new FormControl('', [Validators.required, Validators.maxLength(1), Validators.pattern("[A-Za-z]")]);
    this.CURP = new FormControl('', [Validators.required]);
    if (value.target.value != 0) {
      this.todo = true;
      this.recaptchaC = true;
      this.catalogoService.getRequerimientos(value).subscribe(response => {



        let service = value.target.value.split('.')[0];
        let tramite = value.target.value.split('.')[1];
        this.tramiteGlobal = tramite;
        this.ServicioGlobal = service;

        for (let i = 0; i < this.tramites.length; i++) {

          if (this.tramites[i].idTrmte.split('.')[1] == this.tramiteGlobal) {
            this.delegacionTexto = this.tramites[i].tramite;


          }
        }


        if (response.data.regla1 == "No. Placa") {

          if (tramite == 3) {

            this.NoPlaca = false;
          } else {
            this.NoPlaca = true;


          }

          /* if (tramite == 1) {
             console.log("1 tramite");
             this.NoPlaca = true;
             this.NoSerie = true;
             this.folio = false;
             this.serie = false;
             console.log(  this.folio);
             console.log(  this.serie);
           }*/





        } else {
          this.NoPlaca = false;

        }

        if (response.data.regla2 == "No. Serie" && service != 2) {


          if (tramite == 3) {
            this.NoSerie = false;
          } else {
            this.NoSerie = true;
          }

          if (tramite == 1) {
            this.serie = false;
            this.folio = false;
          } else {
            this.serie = true;
            this.folio = true;
          }
        } else {

          this.NoSerie = false;
        }


        if (service == 2) {

          this.serie = false;
          this.folio = false;
          //   this.NoSerie = false;
        } else if (service != 2 && tramite != 1) {

          this.serie = true;
          this.folio = true;
        }



      })
    } else {
      this.plate = new FormControl('', [Validators.required]);
      this.vin = new FormControl('', [Validators.required]);
      this.paymentFolio = new FormControl('', [Validators.required, Validators.maxLength(8)]);
      this.paymentVin = new FormControl('', [Validators.required, Validators.maxLength(1), Validators.pattern("[A-Za-z]")]);
      this.CURP = new FormControl('', [Validators.required]);

      this.todo = false;
      this.recaptchaC = false;
    }

  }

  delegaciones(json: any) {
    this.catalogoService.delegacionesById(json).subscribe(response => {


      return JSON.stringify(response.data);

    });
  }

  

  convertDateFormat(string: any) {
    var info = string.split('-');
    return info[2] + '-' + info[1] + '-' + info[0];
  }
  refresh(): void {
     window.location.reload();
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

  selected = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  selectFormControl = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  nativeSelectFormControl = new FormControl('valid', [
    Validators.required,
    Validators.pattern('valid'),
  ]);

  matcher = new MyErrorStateMatcher();


}


