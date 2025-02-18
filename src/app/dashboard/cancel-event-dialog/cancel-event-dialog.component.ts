import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cancel-event-dialog',
  imports: [ FormsModule],
  templateUrl: './cancel-event-dialog.component.html',
  styleUrls: ['./cancel-event-dialog.component.css']
})
export class CancelEventDialogComponent {
  cancellationReason: string = '';

  constructor(
    public dialogRef: MatDialogRef<CancelEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmCancellation() {
    this.dialogRef.close(this.cancellationReason);
  }

  close() {
    this.dialogRef.close();
  }
}
