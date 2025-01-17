/**
 * Component responsible for handling user login.
 * Provides a form for users to input their login credentials and authenticates them with the backend.
 */

import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  /**
   * Data model for the user login form inputs.
   * @property {string} Username - The username entered by the user.
   * @property {string} Password - The password entered by the user.
   */
  @Input() userData = { Username: '', Password: '' };

  /**
   * Creates an instance of UserLoginFormComponent.
   * @param fetchApiData - Service to handle API calls.
   * @param dialogRef - Reference to the dialog opened for user login.
   * @param snackBar - Service to display notifications to the user.
   * @param router - Angular Router for navigation.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that is called after the component is initialized.
   */
  ngOnInit(): void {}

  /**
   * Sends the user login data to the backend for authentication.
   * On success:
   * - Closes the login dialog.
   * - Displays a success message.
   * - Saves the token and user information to `localStorage`.
   * - Navigates to the movies page.
   * On failure:
   * - Displays an error message.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe({
      next: (result) => {
        // Logic for a successful user login
        this.dialogRef.close(); // Close the modal on success
        this.snackBar.open('User successfully logged in', 'OK', {
          duration: 2000,
        });

        // Save token and user information to localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        // Navigate to movies page
        this.router.navigate(['movies']);
      },
      error: (error) => {
        console.error('Error during login:', error);
        const errorMessage = error?.error?.errors
          ? error.error.errors.map((err: { msg: string }) => err.msg).join(', ')
          : 'Invalid username or password. Please try again.';
        this.snackBar.open(errorMessage, 'OK', {
          duration: 3000,
        });
      },
      complete: () => {
        console.log('User login request completed.');
      },
    });
  }
}
