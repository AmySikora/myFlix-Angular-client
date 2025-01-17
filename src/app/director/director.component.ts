/**
 * Component responsible for displaying information about a movie director.
 * Retrieves the director's details (name, bio, birth date, and death date) from query parameters and displays them to the user.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.scss'],
})
export class DirectorComponent implements OnInit {
  /**
   * Name of the director to be displayed.
   */
  directorName: string = '';

  /**
   * Biography of the director to be displayed.
   */
  directorBio: string = '';

  /**
   * Birth date of the director to be displayed.
   */
  directorBirth: string = '';

  /**
   * Death date of the director to be displayed (if applicable).
   */
  directorDeath: string = '';

  /**
   * Creates an instance of DirectorComponent.
   * @param route - ActivatedRoute to retrieve query parameters from the URL.
   * @param router - Angular Router for navigation.
   */
  constructor(private route: ActivatedRoute, private router: Router) {}

  /**
   * Lifecycle hook that is called after the component is initialized.
   * Subscribes to query parameters in the URL and sets the director details.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.directorName = params['name'] || 'Unknown';
      this.directorBio = params['bio'] || 'Biography not available';
      this.directorBirth = params['birth'] || 'Birth date not available';
      this.directorDeath = params['death'] || ''; 
    });
  }

  /**
   * Navigates back to the movies list page.
   */
  goBack(): void {
    this.router.navigate(['/movies']);
  }
}
