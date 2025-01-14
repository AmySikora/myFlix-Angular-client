import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA)
      public data: {
        title: string,
        content: string
      },
      public dialogRef: MatDialogRef<InfoDialogComponent>
  ) {}

      ngOnInit(): void {}

      closeInfoDialog(): void {
        this.dialogRef.close();
      }
}
