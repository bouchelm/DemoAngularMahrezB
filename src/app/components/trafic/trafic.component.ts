import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TraficService, StatistiquesTrafic } from '../../services/trafic.service';
import { PlanificationPisteService } from '../../services/planification-piste.service';
import { VolService } from '../../services/vol.service';
import { PisteService } from '../../services/piste.service';
import { Vol } from '../../types/vol';
import { DialogueAffectationComponent, DialogueAffectationData } from './dialogue-affectation.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../avion/confirm-dialog';

@Component({
  selector: 'app-trafic',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './trafic.component.html',
  styleUrl: './trafic.component.css'
})
export class TraficComponent implements OnInit {
  statistiques: StatistiquesTrafic | null = null;
  vols: Vol[] = [];
  arrivees: Vol[] = [];
  assignationsActives: any[] = [];

  colonnesDeparts: string[] = ['numero', 'destination', 'horaire', 'statut', 'piste'];
  colonnesArrivees: string[] = ['numero', 'origine', 'horaire', 'statut', 'piste'];
  colonnesAssignations: string[] = ['vol', 'piste', 'debut', 'fin', 'type', 'actions'];

  urlAeroportExterne = '';

  constructor(
    private traficService: TraficService,
    private planificationService: PlanificationPisteService,
    private volService: VolService,
    private pisteService: PisteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.traficService.calculerStatistiques().subscribe({
      next: (stats) => this.statistiques = stats,
      error: () => this.afficherMessage('Erreur lors du chargement des statistiques', true)
    });

    this.traficService.obtenirDeparts().subscribe({
      next: (data) => this.vols = data,
      error: () => this.afficherMessage('Erreur lors du chargement des départs', true)
    });

    this.traficService.obtenirArrivees().subscribe({
      next: (data) => this.arrivees = data,
      error: () => this.afficherMessage('Erreur lors du chargement des arrivées', true)
    });

    this.planificationService.obtenirAssignationsActives().subscribe({
      next: (data) => this.assignationsActives = data,
      error: () => this.afficherMessage('Erreur lors du chargement des assignations', true)
    });
  }

  ouvrirDialogueAffectation(): void {
    forkJoin([
      this.volService.chargerVols(),
      this.pisteService.chargerPistes()
    ]).subscribe({
      next: ([vols, pistes]) => {
        const dialogData: DialogueAffectationData = {
          vols: vols.map(v => ({ numero: v.numero, destination: v.destination })),
          pistes: pistes.map(p => ({ id: p.identifiant, identifiant: p.identifiant }))
        };

        const dialogRef = this.dialog.open(DialogueAffectationComponent, {
          data: dialogData,
          width: '450px'
        });

        dialogRef.afterClosed().subscribe(resultat => {
          if (resultat) {
            this.planificationService.affecter(resultat).subscribe({
              next: () => {
                this.afficherMessage('Piste affectée avec succès');
                this.chargerDonnees();
              },
              error: () => this.afficherMessage('Erreur lors de l\'affectation', true)
            });
          }
        });
      },
      error: () => this.afficherMessage('Erreur lors de la préparation', true)
    });
  }

  confirmerLiberationPiste(assignation: any): void {
    const dialogData: ConfirmDialogData = {
      title: 'Libérer la piste',
      message: `Voulez-vous vraiment libérer la piste ${assignation.pisteId} ?`
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(confirme => {
      if (confirme) {
        this.planificationService.libererPiste(assignation.id).subscribe({
          next: () => {
            this.afficherMessage('Piste libérée avec succès');
            this.chargerDonnees();
          },
          error: () => this.afficherMessage('Erreur lors de la libération', true)
        });
      }
    });
  }

  formaterHoraire(horaire: string): string {
    const date = new Date(horaire);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
