/**
 * Component responsible for displaying information about a specific movie genre.
 * Retrieves the genre name and description from query parameters and displays them to the user.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss'],
})
export class GenreComponent implements OnInit {
  /**
   * Name of the genre to be displayed.
   */
  genreName: string = '';

  /**
   * Description of the genre to be displayed.
   */
  genreDescription: string = '';

  /**
   * Creates an instance of GenreComponent.
   * @param route - ActivatedRoute to retrieve query parameters from the URL.
   * @param router - Angular Router for navigation.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that is called after the component is initialized.
   * Subscribes to query parameters in the URL and sets the `genreName` and `genreDescription` properties.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.genreName = params['name'] || 'No genre name provided';
      this.genreDescription = params['description'] || 'No description available';
    });
  }

  /**
   * Navigates back to the movies list page.
   */
  goBack(): void {
    this.router.navigate(['/movies']);
  }
}
