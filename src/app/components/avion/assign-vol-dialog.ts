import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-assign-vol-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Assigner à un vol</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="assign-form">
        <mat-form-field appearance="outline">
          <mat-label>ID du vol</mat-label>
          <input matInput formControlName="volId">
          @if (form.get('volId')?.hasError('required')) {
            <mat-error>ID du vol requis</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="form.invalid">
        Assigner
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .assign-form {
      display: flex;
      flex-direction: column;
      min-width: 300px;
      padding-top: 8px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class AssignVolDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssignVolDialogComponent>
  ) {
    this.form = this.fb.group({
      volId: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.volId);
    }
  }
}
