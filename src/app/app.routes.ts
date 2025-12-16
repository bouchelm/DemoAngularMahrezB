import { Routes } from '@angular/router';
import { AvionComponent } from './components/avion/avion';
import { VolComponent } from './components/vol/vol';
import { PisteComponent } from './components/piste/piste';
import { HangarComponent } from './components/hangar/hangar';
import { TraficComponent } from './components/trafic/trafic.component';
import { PageAcceuil } from './components/page-acceuil/page-acceuil';

export const routes: Routes = [
    { path: '', component: PageAcceuil },
  { path: 'avions', component: AvionComponent },
  { path: 'vols', component: VolComponent },
  { path: 'pistes', component: PisteComponent },
  { path: 'hangars', component: HangarComponent },
  { path: 'trafic', component: TraficComponent }
];
