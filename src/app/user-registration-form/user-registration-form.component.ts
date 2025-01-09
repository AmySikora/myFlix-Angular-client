import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void { }

  // Function to send user data to backend for registration
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: (response) => {
        // On success, close the modal and display a success message
        this.dialogRef.close();
        console.log('Registration successful:', response);
        this.snackBar.open('User registered successfully', 'OK', {
          duration: 2000,
        });
      },
      error: (error) => {
        // On error, log the error and display a meaningful message to the user
        console.error('Registration error:', error);
        this.snackBar.open(
          error.error?.message || 'Something went wrong. Please try again.',
          'OK',
          {
            duration: 2000,
          }
        );
      },
    });
  }
}
