import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { Vol, VolCreationRequest, StatutVol, Ville } from '../types/vol';
import { IProxyVol } from './proxies/i-proxy-vol';
import { ProxyVolReel } from './proxies/proxy-vol-reel';

@Injectable({
  providedIn: 'root'
})
export class VolService {
  private proxy: IProxyVol;

  constructor(proxyVol: ProxyVolReel) {
    this.proxy = proxyVol;
  }

  chargerVols(): Observable<Vol[]> {
    return forkJoin([
      this.proxy.obtenirDeparts(),
      this.proxy.obtenirArrivees()
    ]).pipe(
      map(([departs, arrivees]) => {
        const volsMap = new Map<number, Vol>();
        departs.forEach(vol => volsMap.set(vol.numero, vol));
        arrivees.forEach(vol => volsMap.set(vol.numero, vol));
        return Array.from(volsMap.values());
      })
    );
  }

  obtenirDeparts(): Observable<Vol[]> {
    return this.proxy.obtenirDeparts();
  }

  obtenirArrivees(): Observable<Vol[]> {
    return this.proxy.obtenirArrivees();
  }

  obtenirVol(numero: number): Observable<Vol> {
    return this.proxy.obtenirVol(numero);
  }

  creerVol(requete: VolCreationRequest): Observable<Vol> {
    return this.proxy.creerVol(requete);
  }

  modifierVol(numero: number, requete: VolCreationRequest): Observable<Vol> {
    return this.proxy.modifierVol(numero, requete);
  }

  supprimerVol(numero: number): Observable<void> {
    return this.proxy.supprimerVol(numero);
  }

  compterVolsParStatut(vols: Vol[]): { total: number; enCours: number; prevus: number; termines: number } {
    const statutsEnCours = [StatutVol.EN_VOL, StatutVol.DECOLLE];
    const statutsPrevus = [StatutVol.PREVU, StatutVol.EN_ATTENTE, StatutVol.EMBARQUEMENT];
    const statutsTermines = [StatutVol.ARRIVE, StatutVol.ANNULE];

    return {
      total: vols.length,
      enCours: vols.filter(v => statutsEnCours.includes(v.statut)).length,
      prevus: vols.filter(v => statutsPrevus.includes(v.statut)).length,
      termines: vols.filter(v => statutsTermines.includes(v.statut)).length
    };
  }

  filtrerVols(vols: Vol[], filtreStatut: StatutVol | null, filtreOrigine: Ville | null, filtreDestination: Ville | null): Vol[] {
    return vols.filter(vol => {
      const matchStatut = !filtreStatut || vol.statut === filtreStatut;
      const matchOrigine = !filtreOrigine || vol.origine === filtreOrigine;
      const matchDestination = !filtreDestination || vol.destination === filtreDestination;
      return matchStatut && matchOrigine && matchDestination;
    });
  }
}