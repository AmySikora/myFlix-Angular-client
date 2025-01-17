/**
 * Component responsible for displaying the description of a specific movie.
 * Retrieves the movie's title and description from query parameters and displays them to the user.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
})
export class DescriptionComponent implements OnInit {
  /**
   * Title of the movie to be displayed.
   */
  movieTitle: string = '';

  /**
   * Description of the movie to be displayed.
   */
  movieDescription: string = '';

  /**
   * Creates an instance of DescriptionComponent.
   * @param route - ActivatedRoute to retrieve query parameters from the URL.
   * @param router - Angular Router for navigation.
   */
  constructor(private route: ActivatedRoute, private router: Router) {}

  /**
   * Lifecycle hook that is called after the component is initialized.
   * Subscribes to query parameters in the URL and sets the `movieTitle` and `movieDescription` properties.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.movieTitle = params['title'] || 'Unknown Title';
      this.movieDescription = params['description'] || 'No description available.';
    });
  }

  /**
   * Navigates back to the movies list page.
   */
  goBack(): void {
    this.router.navigate(['/movies']); // Navigate back to movie cards
  }
}
