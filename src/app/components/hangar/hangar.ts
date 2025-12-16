import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HangarService } from '../../services/hangar.service';
import { Hangar } from '../../types/hangar';
import { DialogueHangarComponent, DialogueHangarData } from './dialogue-hangar.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../avion/confirm-dialog';

@Component({
  selector: 'app-hangar',
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
  templateUrl: './hangar.html',
  styleUrl: './hangar.css',
})
export class HangarComponent implements OnInit {
  colonnesAffichees: string[] = ['identifiant', 'type', 'capacity', 'etat', 'actions'];
  mesHangars: Hangar[] = [];

  nombreTotal = 0;
  nombreOuverts = 0;
  nombreFermes = 0;
  nombreMaintenance = 0;

  constructor(
    private hangarService: HangarService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.chargerHangars();
  }

  chargerHangars(): void {
    this.hangarService.chargerHangars().subscribe({
      next: (data) => {
        this.mesHangars = data;
        this.mettreAJourStatistiques();
      },
      error: () => this.afficherMessage('Erreur lors du chargement des hangars', true)
    });
  }

  mettreAJourStatistiques(): void {
    const stats = this.hangarService.compterHangarsParEtat(this.mesHangars);
    this.nombreTotal = stats.total;
    this.nombreOuverts = stats.ouverts;
    this.nombreFermes = stats.fermes;
    this.nombreMaintenance = stats.maintenance;
  }

  ouvrirDialogueAjout(): void {
    const dialogData: DialogueHangarData = { estModification: false };
    const dialogRef = this.dialog.open(DialogueHangarComponent, {
      data: dialogData,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(resultat => {
      if (resultat) {
        this.hangarService.creerHangar(resultat).subscribe({
          next: () => {
            this.afficherMessage('Hangar ajouté avec succès');
            this.chargerHangars();
          },
          error: () => this.afficherMessage('Erreur lors de l\'ajout', true)
        });
      }
    });
  }

  ouvrirDialogueModification(hangar: Hangar): void {
    const dialogData: DialogueHangarData = { hangar, estModification: true };
    const dialogRef = this.dialog.open(DialogueHangarComponent, {
      data: dialogData,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(resultat => {
      if (resultat) {
        this.hangarService.modifierHangar(hangar.identifiant, resultat).subscribe({
          next: () => {
            this.afficherMessage('Hangar modifié avec succès');
            this.chargerHangars();
          },
          error: () => this.afficherMessage('Erreur lors de la modification', true)
        });
      }
    });
  }

  confirmerSuppression(hangar: Hangar): void {
    const dialogData: ConfirmDialogData = {
      title: 'Supprimer le hangar',
      message: `Voulez-vous vraiment supprimer le hangar ${hangar.identifiant} ?`
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(confirme => {
      if (confirme) {
        this.hangarService.supprimerHangar(hangar.identifiant).subscribe({
          next: () => {
            this.afficherMessage('Hangar supprimé avec succès');
            this.chargerHangars();
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
