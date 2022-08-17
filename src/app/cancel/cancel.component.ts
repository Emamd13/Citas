import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { CancelService } from '../service/cancel.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.css']
})
export class CancelComponent implements OnInit {
  clave = new FormControl('', [Validators.required]);
  correo = new FormControl('', [Validators.required, Validators.email]);
  firstFormGroup: FormGroup;
  closeResult: string = '';
  constructor(private cancelService: CancelService, public modal: NgxSmartModalService, private _formBuilder: FormBuilder, private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  search(content: any): void {
    this.cancelService.search(this.clave.value, this.correo.value).subscribe(response => {
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


  cancelar() {
    Swal.fire({
      title: 'Esta seguro en cancelar este tramite?',
      text: "Una vez cancelado no se podrá recuperar la cita agendada!",
      icon: 'warning',
      showCancelButton: true,
    
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si deseo cancelar',
      cancelButtonText:'No deseo cancelar',
    }).then((result) => {
      if (result.isConfirmed) {


        this.cancelService.cancel(this.clave.value, this.firstFormGroup.value.tramite, this.correo.value).subscribe(response => {
          console.log(response);

          if (response.data) {
            Swal.fire({
                title: 'Cita Cancelada!',
                text: 'Su cita ha sido cancelada.',
                icon: 'success',
                timer: 4000
            }).then(() => {
              window.location.reload();
            });
          }

        });

     
      }
    })
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
}
