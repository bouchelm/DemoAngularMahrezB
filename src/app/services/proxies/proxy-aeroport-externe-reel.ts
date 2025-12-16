import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IProxyAeroportExterne } from './i-proxy-aeroport-externe';
import { Vol } from '../../types/vol';

@Injectable({
  providedIn: 'root'
})
export class ProxyAeroportExterneReel extends IProxyAeroportExterne {
  constructor(private http: HttpClient) {
    super();
  }

  consulterVolsEntrants(urlBase: string): Observable<Vol[]> {
    return of([]);
  }

  consulterVolsSortants(urlBase: string): Observable<Vol[]> {
    return of([]);
  }
}
