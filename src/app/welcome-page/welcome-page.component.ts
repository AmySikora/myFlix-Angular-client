/**
 * Component responsible for displaying the welcome page.
 * Provides dialogs for user registration and login.
 */

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  /**
   * Creates an instance of WelcomePageComponent.
   * @param dialog - Service to open Angular Material dialogs.
   */
  constructor(public dialog: MatDialog) {}

  /**
   * Lifecycle hook that is called after the component is initialized.
   */
  ngOnInit(): void {}

  /**
   * Opens the user registration dialog.
   * Displays the `UserRegistrationFormComponent` in a modal dialog.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }

  /**
   * Opens the user login dialog.
   * Displays the `UserLoginFormComponent` in a modal dialog.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }
}
