// src/app/user-login-form/user-login-form.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  // This is the function responsible for sending the form inputs to the backend
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