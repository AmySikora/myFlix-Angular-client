import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * A reusable dialog component for displaying information such as genre, director, or movie description.
 * This component is used to display a pop-up modal with a title and content passed via `MAT_DIALOG_DATA`.
 */
@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss'],
})
export class InfoDialogComponent implements OnInit {
  /**
   * Creates an instance of InfoDialogComponent.
   * @param data - The data injected into the dialog, including the title and content to display.
   * @param dialogRef - Reference to the currently open dialog, used to close it.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; content: string },
    public dialogRef: MatDialogRef<InfoDialogComponent>
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Logs the dialog data to the console.
   */
  ngOnInit(): void {
    console.log('Dialog Data:', this.data);
  }

  /**
   * Closes the dialog.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
