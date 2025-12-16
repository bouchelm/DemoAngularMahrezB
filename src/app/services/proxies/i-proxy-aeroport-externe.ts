import { Observable } from 'rxjs';
import { Vol } from '../../types/vol';

export abstract class IProxyAeroportExterne {
  abstract consulterVolsEntrants(urlBase: string): Observable<Vol[]>;
  abstract consulterVolsSortants(urlBase: string): Observable<Vol[]>;
}
