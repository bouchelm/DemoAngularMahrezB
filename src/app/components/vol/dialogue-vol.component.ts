import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Vol, StatutVol, Ville } from '../../types/vol';

export interface DialogueVolData {
  vol?: Vol;
  estModification: boolean;
}

@Component({
  selector: 'app-dialogue-vol',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.estModification ? 'Modifier' : 'Ajouter' }} un vol</h2>
    <mat-dialog-content>
      <form [formGroup]="formulaireVol" class="vol-form">
        <mat-form-field appearance="outline">
          <mat-label>Numéro</mat-label>
          <input matInput type="number" formControlName="numero" [readonly]="data.estModification">
          @if (formulaireVol.get('numero')?.hasError('required')) {
            <mat-error>Numéro requis</mat-error>
          }
          @if (formulaireVol.get('numero')?.hasError('min')) {
            <mat-error>Le numéro doit être positif</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Origine</mat-label>
          <mat-select formControlName="origine">
            @for (ville of villes; track ville) {
              <mat-option [value]="ville">{{ ville }}</mat-option>
            }
          </mat-select>
          @if (formulaireVol.get('origine')?.hasError('required')) {
            <mat-error>Origine requise</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Destination</mat-label>
          <mat-select formControlName="destination">
            @for (ville of villes; track ville) {
              <mat-option [value]="ville">{{ ville }}</mat-option>
            }
          </mat-select>
          @if (formulaireVol.get('destination')?.hasError('required')) {
            <mat-error>Destination requise</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Horaire</mat-label>
          <input matInput type="datetime-local" formControlName="horaire">
          @if (formulaireVol.get('horaire')?.hasError('required')) {
            <mat-error>Horaire requis</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="statut">
            @for (s of statuts; track s) {
              <mat-option [value]="s">{{ s }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Immatriculation avion (optionnel)</mat-label>
          <input matInput formControlName="avionImmatriculation">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="annuler()">Annuler</button>
      <button mat-raised-button color="primary" (click)="valider()" [disabled]="formulaireVol.invalid">
        {{ data.estModification ? 'Modifier' : 'Ajouter' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .vol-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 350px;
      padding-top: 8px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class DialogueVolComponent {
  formulaireVol: FormGroup;
  villes = Object.values(Ville);
  statuts = Object.values(StatutVol);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogueVolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogueVolData
  ) {
    this.formulaireVol = this.fb.group({
      numero: [data.vol?.numero || '', [Validators.required, Validators.min(1)]],
      origine: [data.vol?.origine || '', Validators.required],
      destination: [data.vol?.destination || '', Validators.required],
      horaire: [this.formatHoraire(data.vol?.horaire), Validators.required],
      statut: [data.vol?.statut || StatutVol.PREVU],
      avionImmatriculation: [data.vol?.avionImmatriculation || '']
    });
  }

  private formatHoraire(horaire?: string): string {
    if (!horaire) return '';
    const date = new Date(horaire);
    return date.toISOString().slice(0, 16);
  }

  annuler(): void {
    this.dialogRef.close();
  }

  valider(): void {
    if (this.formulaireVol.valid) {
      const valeurs = this.formulaireVol.value;
      this.dialogRef.close({
        ...valeurs,
        horaire: new Date(valeurs.horaire).toISOString(),
        avionImmatriculation: valeurs.avionImmatriculation || null
      });
    }
  }
}
