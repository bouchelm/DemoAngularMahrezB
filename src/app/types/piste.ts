export enum EtatPiste {
  LIBRE = 'LIBRE',
  OCCUPEE = 'OCCUPEE',
  EN_MAINTENANCE = 'EN_MAINTENANCE'
}

export interface Piste {
  identifiant: string;
  longueur: number;
  etat: EtatPiste;
}

export interface PisteCreationRequest {
  identifiant: string;
  longueur: number;
  etat: EtatPiste;
}