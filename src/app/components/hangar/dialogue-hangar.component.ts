import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Hangar, TypeHangar, EtatHangar } from '../../types/hangar';

export interface DialogueHangarData {
  hangar?: Hangar;
  estModification: boolean;
}

@Component({
  selector: 'app-dialogue-hangar',
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
    <h2 mat-dialog-title>{{ data.estModification ? 'Modifier' : 'Ajouter' }} un hangar</h2>
    <mat-dialog-content>
      <form [formGroup]="formulaireHangar" class="hangar-form">
        <mat-form-field appearance="outline">
          <mat-label>Identifiant</mat-label>
          <input matInput formControlName="identifiant" [readonly]="data.estModification">
          @if (formulaireHangar.get('identifiant')?.hasError('required')) {
            <mat-error>Identifiant requis</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type">
            @for (t of types; track t) {
              <mat-option [value]="t">{{ t }}</mat-option>
            }
          </mat-select>
          @if (formulaireHangar.get('type')?.hasError('required')) {
            <mat-error>Type requis</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Capacité</mat-label>
          <input matInput type="number" formControlName="capacity">
          @if (formulaireHangar.get('capacity')?.hasError('required')) {
            <mat-error>Capacité requise</mat-error>
          }
          @if (formulaireHangar.get('capacity')?.hasError('min')) {
            <mat-error>La capacité doit être positive</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>État</mat-label>
          <mat-select formControlName="etat">
            @for (e of etats; track e) {
              <mat-option [value]="e">{{ e }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="annuler()">Annuler</button>
      <button mat-raised-button color="primary" (click)="valider()" [disabled]="formulaireHangar.invalid">
        {{ data.estModification ? 'Modifier' : 'Ajouter' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .hangar-form {
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
export class DialogueHangarComponent {
  formulaireHangar: FormGroup;
  types = Object.values(TypeHangar);
  etats = Object.values(EtatHangar);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogueHangarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogueHangarData
  ) {
    this.formulaireHangar = this.fb.group({
      identifiant: [data.hangar?.identifiant || '', Validators.required],
      type: [data.hangar?.type || '', Validators.required],
      capacity: [data.hangar?.capacity || '', [Validators.required, Validators.min(1)]],
      etat: [data.hangar?.etat || EtatHangar.OUVERT]
    });
  }

  annuler(): void {
    this.dialogRef.close();
  }

  valider(): void {
    if (this.formulaireHangar.valid) {
      this.dialogRef.close(this.formulaireHangar.value);
    }
  }
}
