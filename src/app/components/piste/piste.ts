import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PisteService } from '../../services/piste.service';
import { Piste } from '../../types/piste';
import { DialoguePisteComponent, DialoguePisteData } from './dialogue-piste.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../avion/confirm-dialog';

@Component({
  selector: 'app-piste',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './piste.html',
  styleUrl: './piste.css',
})
export class PisteComponent implements OnInit {
  colonnesAffichees: string[] = ['identifiant', 'longueur', 'etat', 'actions'];
  mesPistes: Piste[] = [];

  nombreTotal = 0;
  nombreLibres = 0;
  nombreOccupees = 0;
  nombreMaintenance = 0;

  constructor(
    private pisteService: PisteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.chargerPistes();
  }

  chargerPistes(): void {
    this.pisteService.chargerPistes().subscribe({
      next: (data) => {
        this.mesPistes = data;
        this.mettreAJourStatistiques();
      },
      error: () => this.afficherMessage('Erreur lors du chargement des pistes', true)
    });
  }

  mettreAJourStatistiques(): void {
    const stats = this.pisteService.compterPistesParEtat(this.mesPistes);
    this.nombreTotal = stats.total;
    this.nombreLibres = stats.libres;
    this.nombreOccupees = stats.occupees;
    this.nombreMaintenance = stats.maintenance;
  }

  ouvrirDialogueAjout(): void {
    const dialogData: DialoguePisteData = { estModification: false };
    const dialogRef = this.dialog.open(DialoguePisteComponent, {
      data: dialogData,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(resultat => {
      if (resultat) {
        this.pisteService.creerPiste(resultat).subscribe({
          next: () => {
            this.afficherMessage('Piste ajoutée avec succès');
            this.chargerPistes();
          },
          error: () => this.afficherMessage('Erreur lors de l\'ajout', true)
        });
      }
    });
  }

  ouvrirDialogueModification(piste: Piste): void {
    const dialogData: DialoguePisteData = { piste, estModification: true };
    const dialogRef = this.dialog.open(DialoguePisteComponent, {
      data: dialogData,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(resultat => {
      if (resultat) {
        this.pisteService.modifierPiste(piste.identifiant, resultat).subscribe({
          next: () => {
            this.afficherMessage('Piste modifiée avec succès');
            this.chargerPistes();
          },
          error: () => this.afficherMessage('Erreur lors de la modification', true)
        });
      }
    });
  }

  confirmerSuppression(piste: Piste): void {
    const dialogData: ConfirmDialogData = {
      title: 'Supprimer la piste',
      message: `Voulez-vous vraiment supprimer la piste ${piste.identifiant} ?`
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(confirme => {
      if (confirme) {
        this.pisteService.supprimerPiste(piste.identifiant).subscribe({
          next: () => {
            this.afficherMessage('Piste supprimée avec succès');
            this.chargerPistes();
          },
          error: () => this.afficherMessage('Erreur lors de la suppression', true)
        });
      }
    });
  }

  private afficherMessage(message: string, estErreur: boolean = false): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: estErreur ? ['error-snackbar'] : ['success-snackbar']
    });
  }
}
