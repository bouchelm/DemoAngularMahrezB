import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Avion, AvionCreationRequest } from '../types/avion';
import { IProxyAvion } from './proxies/i-proxy-avion';
import { ProxyAvionReel } from './proxies/proxy-avion-reel';

@Injectable({
  providedIn: 'root'
})
export class AvionService {
  private proxy: IProxyAvion;

  constructor(proxyAvion: ProxyAvionReel) {
    this.proxy = proxyAvion;
  }

  getAvions(): Observable<Avion[]> {
    return this.proxy.obtenirTousLesAvions();
  }

  chargerAvions(): Observable<Avion[]> {
    return this.proxy.obtenirTousLesAvions();
  }

  obtenirAvion(immatriculation: string): Observable<Avion> {
    return this.proxy.obtenirAvion(immatriculation);
  }

  createAvion(requete: AvionCreationRequest): Observable<Avion> {
    return this.proxy.creerAvion(requete);
  }

  creerAvion(requete: AvionCreationRequest): Observable<Avion> {
    return this.proxy.creerAvion(requete);
  }

  updateAvion(immatriculation: string, requete: AvionCreationRequest): Observable<Avion> {
    return this.proxy.modifierAvion(immatriculation, requete);
  }

  modifierAvion(immatriculation: string, requete: AvionCreationRequest): Observable<Avion> {
    return this.proxy.modifierAvion(immatriculation, requete);
  }

  deleteAvion(immatriculation: string): Observable<void> {
    return this.proxy.supprimerAvion(immatriculation);
  }

  supprimerAvion(immatriculation: string): Observable<void> {
    return this.proxy.supprimerAvion(immatriculation);
  }

  assignerVol(immatriculation: string, numeroVol: number): Observable<void> {
    return this.proxy.assignerVol(immatriculation, numeroVol);
  }
}