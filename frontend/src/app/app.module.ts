import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './pages/header/header.component';
import { AppComponent } from './app.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { LaunchpadComponent } from './pages/launchpad/launchpad.component';
import { GestionOrdenesComponent } from './pages/gestion-ordenes/gestion-ordenes.component';
import { GestionInfraestructuraComponent } from './pages/gestion-infraestructura/gestion-infraestructura.component';
import { GestionOperariosComponent } from './pages/gestion-operarios/gestion-operarios.component';
import { EdificeComponent } from './components/edifice/edifice.component';
import { FloorComponent } from './components/floor/floor.component';
import { SectorComponent } from './components/sector/sector.component';
import { SiteComponent } from './components/site/site.component';
import { AssetTypeComponent } from './components/asset-type/asset-type.component';
import { TagComponent } from './components/tag/tag.component';
import { TaskComponent } from './components/task/task.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskTypeComponent } from './components/task-type/task-type.component';
import { OtComponent } from './components/ot/ot.component';
import { CrearOrdenComponent } from './components/crear-orden/crear-orden.component';
import { LogoutComponent } from './components/logout/logout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { OtOperarioComponent } from './components/ot-operario/ot-operario.component';

@NgModule({
  declarations: [
    HeaderComponent,
    AppComponent,
    RegistroComponent,
    LoginComponent,
    LaunchpadComponent,
    GestionOrdenesComponent,
    GestionInfraestructuraComponent,
    GestionOperariosComponent,
    EdificeComponent,
    FloorComponent,
    SectorComponent,
    SiteComponent,
    AssetTypeComponent,
    TagComponent,
    TaskComponent,
    TaskListComponent,
    TaskTypeComponent,
    OtComponent,
    CrearOrdenComponent,
    LogoutComponent,
    NotFoundComponent,
    OtOperarioComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
