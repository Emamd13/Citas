import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';

import { PrintComponent } from './print/print.component';
import { CancelComponent } from './cancel/cancel.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { CatalogosService } from './service/catalogos.service';
import { RegisterService } from './service/register.service';
import { ReprintService } from './service/reprint.service';
import { CancelService } from './service/cancel.service';

import { RegisterComponent } from './schedule/register/register.component';

import {MatTooltipModule} from '@angular/material/tooltip';
import { DialogComponent } from './schedule/register/register.component'; 
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatListModule } from '@angular/material/list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import {MatDialogModule} from '@angular/material/dialog';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);


const routes: Routes = [
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: 'menu', component: MenuComponent },
  { path: 'agendar', component: ScheduleComponent },
  { path: 'reimprimir', component: PrintComponent },
  { path: 'cancelar', component: CancelComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    PrintComponent,
    CancelComponent,
    ScheduleComponent,
    RegisterComponent,
    DialogComponent
     
  
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatStepperModule,
    MatButtonModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    NgxSpinnerModule,
    MatListModule,
    MatDatepickerModule,
    FullCalendarModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    PdfViewerModule,
    NgxSmartModalModule.forRoot(),
    MatDialogModule,
    MatTooltipModule,
    NgbModule,
    LeafletModule
    
  ],
  exports: [
    MatSortModule
  ],
  providers: [CatalogosService,
    RegisterService,
    ReprintService,
    CancelService,
    NgxSmartModalService,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    }],
    entryComponents: [
      MatDialogModule
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
