/**
 * Component responsible for handling user registration.
 * Provides a form for users to input their data and sends the data to the backend.
 */

import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent implements OnInit {
  /**
   * Data model for the user registration form inputs.
   * @property {string} Username - The username of the new user.
   * @property {string} Password - The password of the new user.
   * @property {string} Email - The email address of the new user.
   * @property {string} Birthday - The birth date of the new user.
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * Creates an instance of UserRegistrationFormComponent.
   * @param fetchApiData - Service to handle API calls.
   * @param dialogRef - Reference to the dialog opened for user registration.
   * @param snackBar - Service to display notifications to the user.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  /**
   * Lifecycle hook that is called after the component is initialized.
   */
  ngOnInit(): void {}

  /**
   * Sends the user registration data to the backend.
   * Closes the dialog and displays a success or error message upon completion.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: (result) => {
        // Logic for a successful user registration
        this.dialogRef.close(); // Close the modal on success
        this.snackBar.open('User registered successfully', 'OK', {
          duration: 2000,
        });
      },
      error: (error) => {
        console.error('Error during registration:', error);
        const errorMessage = error?.error?.errors
          ? error.error.errors.map((err: { msg: string }) => err.msg).join(', ')
          : 'Something went wrong. Please try again.';
        this.snackBar.open(errorMessage, 'OK', {
          duration: 3000,
        });
      },
      complete: () => {
        console.log('User registration request completed.');
      },
    });
  }
}
