/**
 * Component responsible for displaying movie cards, allowing search, and managing user actions such as viewing genres, directors, descriptions, and modifying favorite movies.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  /**
   * List of all movies fetched from the API.
   */
  movies: any[] = [];

  /**
   * Filtered list of movies based on search query.
   */
  filteredMovies: any[] = [];

  /**
   * Search query entered by the user.
   */
  searchQuery: string = '';

  /**
   * Current user data retrieved from localStorage.
   */
  user: any = {};

  /**
   * Creates an instance of MovieCardComponent.
   * @param fetchApiData - Service to fetch data from the API.
   * @param dialog - Material Dialog for displaying popups.
   * @param router - Angular Router for navigation.
   */
  constructor(
    private fetchApiData: FetchApiDataService, 
    private dialog: MatDialog,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that is called after component initialization.
   */
  ngOnInit(): void {
    this.loadUserData();
    this.getMovies();
  }

  /**
   * Loads the current user data from localStorage.
   */
  loadUserData(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  /**
   * Clears the search query and resets the filtered movies to the full list.
   */
  clearSearch(): void {
    this.searchQuery = '';
    this.filteredMovies = this.movies;
  }

  /**
   * Filters movies based on the user's search query.
   */
  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredMovies = this.movies.filter((movie) =>
      movie.Title.toLowerCase().includes(query) ||
      movie.Director.Name.toLowerCase().includes(query) ||
      movie.Genre.Name.toLowerCase().includes(query)
    );
  }

  /**
   * Navigates to the user profile page.
   */
  goToProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Lets the user open move card when clicking on title.
   */
  showMovieDetails(movie: any): void {
    this.dialog.open(InfoDialogComponent, {
      data: {
        title: movie.Title || 'Unknown Title',
        content: movie.Description || 'No description avaliable'
      },
      width: '400px',
    });
  }

  /**
   * Logs the user out and navigates to the welcome page.
   */
  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  /**
   * Opens a dialog to display genre information for a given movie.
   * @param movie - The movie whose genre information will be displayed.
   */
  showGenre(movie: any): void {
    this.dialog.open(InfoDialogComponent, {
      data: {
        title: movie.Name || 'Unknown Genre', 
        content: movie.Description || 'No description available.', 
      },
      width: '400px',
    });
  }

  /**
   * Opens a dialog to display director information for a given movie.
   * @param movie - The movie whose director information will be displayed.
   */
  showDirector(movie: any): void {
    this.dialog.open(InfoDialogComponent, {
      data: {
        title: movie.Name || 'Unknown Director',
        content: `${movie.Bio || 'No bio available.'} ${
          movie.Birth ? `(Born: ${movie.Birth})` : ''
        } ${movie.Death ? `(Died: ${movie.Death})` : ''}`,
      },
      width: '400px',
    });
  }
  
  /**
   * Opens a dialog to display the description of a given movie.
   * @param movie - The movie whose description will be displayed.
   */
  showDescription(movie: any): void {
    this.dialog.open(InfoDialogComponent, {
      data: {
        title: movie.Title || 'Unknown Title',
        content: movie.Description || 'No description available.',
      },
      width: '400px',
    });
  }
  
  /**
   * Fetches all movies from the API and updates the local movie list.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe({
      next: (movies: any[]) => {
        this.movies = movies.map((movie) => ({
          ...movie,
          isFavorite: this.user.FavoriteMovies?.includes(movie._id),
        }));
        this.filteredMovies = [...this.movies];
      },
      error: (err: any) => console.error('Error fetching movies:', err),
    });
  }

  /**
   * Adds or removes a movie from the user's list of favorite movies.
   * @param movie - The movie to add or remove from favorites.
   */
  modifyFavoriteMovies(movie: any): void {
    if (this.user.FavoriteMovies?.includes(movie._id)) {
      // Remove from favorites
      this.fetchApiData.deleteFavorite(movie._id).subscribe({
        next: (res: any) => {
          this.user.FavoriteMovies = res.FavoriteMovies;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.movies = this.movies.map((m) =>
            m._id === movie._id ? { ...m, isFavorite: false } : m
          );
          this.filteredMovies = [...this.movies];
        },
        error: (err: any) => console.error('Error removing favorite:', err),
      });
    } else {
      // Add to favorites
      this.fetchApiData.addFavoriteMovie(movie._id).subscribe({
        next: (res: any) => {
          this.user.FavoriteMovies = res.FavoriteMovies;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.movies = this.movies.map((m) =>
            m._id === movie._id ? { ...m, isFavorite: true } : m
          );
          this.filteredMovies = [...this.movies];
        },
        error: (err: any) => console.error('Error adding favorite:', err),
      });
    }
  }
}
