import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ReprintService } from '../service/reprint.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {
  clave = new FormControl('', [Validators.required]);
  correo = new FormControl('', [Validators.required, Validators.email]);
  firstFormGroup: FormGroup;
  closeResult: string = '';
  constructor(private reprintService: ReprintService, public modal: NgxSmartModalService, private _formBuilder: FormBuilder, private modalService: NgbModal) { }

  ngOnInit(): void {



  }


  search(content: any): void {
    this.reprintService.search(this.clave.value, this.correo.value).subscribe(response => {
      ///console.log(response.data.slctnteNombre);

      /* this.firstFormGroup.value.nombre = response.data.slctnteNombre;
       this.firstFormGroup.value.delegacion = response.data.dlgcion;
       this.firstFormGroup.value.fecha = response.data.citaFcha;
       this.firstFormGroup.value.hora = response.data.hrrio;
       this.firstFormGroup.value.tramite = response.data.trmte;*/

      if (response.data != null) {
        this.firstFormGroup = this._formBuilder.group({


          nombre: [response.data.slctnteNombre],
          delegacion: [response.data.dlgcion],
          fecha: [response.data.citaFcha], //, Validators.maxLength(10), Validators.pattern(this.numberRegEx)
          hora: [response.data.hrrio],
          tramite: [response.data.trmte]

        });

        this.modalService.open(content, {
          size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static',
          keyboard: false
        }).result.then((result) => {

          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {

          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      } else {


        Swal.fire({
          icon: 'error',
          title: 'Ocurrio un error...',
          text: 'Los datos colocados no son correctos !',
       
        })
      }



    });
  }
  close() {

    window.location.reload();
  }


  print() {
    this.reprintService.print(this.clave.value, this.firstFormGroup.value.tramite).subscribe(response => {
      console.log(response);
      if (response.data != null) {

        //                    var blob = new Blob([arrayBufferToBase64(response.data.citaPDF)], {type: 'application/pdf'});
        const linkSource = `data:application/pdf;base64,${this.arrayBufferToBase64(response.data.citaPDF)}`;
        const downloadLink = document.createElement("a");
        const fileName = "Cita.pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Ocurrio un error, vuelve ha intentarlo.',
          icon: 'error',
          timer: 3000
        }).then(() => {
          window.location.reload();
        });
      }
    });
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
  arrayBufferToBase64(buffer: any) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

}
