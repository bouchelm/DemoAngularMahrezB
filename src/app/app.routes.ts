import { Routes } from '@angular/router';
import { Avion } from './components/avion/avion';
import { Vol } from './components/vol/vol';
import { Piste } from './components/piste/piste';
import { Hangar } from './components/hangar/hangar';
import { PageAcceuil } from './components/page-acceuil/page-acceuil';

export const routes: Routes = [
    { path: '', component:PageAcceuil },
  { path: 'avions', component: Avion },
  { path: 'vols', component: Vol },
  { path: 'pistes', component: Piste },
  { path: 'hangars', component: Hangar }
];
