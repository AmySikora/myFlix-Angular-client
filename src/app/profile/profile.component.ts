import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component for managing the user profile.
 * Allows users to view and update their profile details, manage favorite movies, and delete their account.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  /** Form group for editing user profile. */
  editForm: FormGroup;

  /** Current user data. */
  user: any = {};

  /** List of the user's favorite movies. */
  favoriteMovies: any[] = [];

  constructor(
    private fetchApiData: FetchApiDataService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Initialize the form group with validation rules
    this.editForm = this.formBuilder.group({
      Username: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Birthday: [''],
      Password: ['', Validators.required],
    });
  }

  /**
   * Lifecycle hook that runs on component initialization.
   * Loads the user's profile and favorite movies.
   */
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.snackBar.open('User data is missing. Please log in again.', 'OK', { duration: 3000 });
      this.router.navigate(['welcome']);
      return;
    }

    this.loadUserProfile();
  }

  /**
   * Loads the user's profile data and favorite movies from the API.
   */
  loadUserProfile(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = user;

    this.editForm.patchValue({
      Username: user.Username,
      Email: user.Email,
      Birthday: user.Birthday ? user.Birthday.split('T')[0] : '',
    });

    this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
      this.favoriteMovies = movies.filter((movie) =>
        user.FavoriteMovies?.includes(movie._id)
      );
    });
  }

  /**
   * Updates the user's profile information via the API.
   */
  updateUserProfile(): void {
    const updatedUserData = {
      Username: this.editForm.value.Username,
      Email: this.editForm.value.Email,
      Birthday: this.editForm.value.Birthday,
      Password: this.editForm.value.Password,
    };

    const username = this.user.Username;

    this.fetchApiData.updateUser(username, updatedUserData).subscribe({
      next: (res: any) => {
        this.snackBar.open('Profile updated successfully!', 'OK', { duration: 3000 });
        localStorage.setItem('user', JSON.stringify(res));
        this.loadUserProfile();
      },
      error: () => {
        this.snackBar.open('Failed to update profile. Please try again.', 'OK', { duration: 3000 });
      },
    });
  }

  /**
   * Fetches updated user data from the API.
   */
  fetchUserData(): void {
    this.fetchApiData.getUser().subscribe({
      next: (res: any) => {
        this.user = res;
        this.editForm.patchValue({
          Username: this.user.Username,
          Email: this.user.Email,
          Birthday: this.user.Birthday,
        });
      },
      error: (err: any) => {
        console.error('Error fetching user data:', err);
      },
    });
  }

  /**
   * Deletes the user's account.
   */
  deleteAccount(): void {
    const username = this.user.Username;

    this.fetchApiData.deleteUser(username).subscribe(
      () => {
        this.snackBar.open('Account deleted successfully.', 'OK', { duration: 3000 });
        localStorage.clear();
        this.router.navigate(['welcome']);
      },
      () => {
        this.snackBar.open('Failed to delete account.', 'OK', { duration: 3000 });
      }
    );
  }

  /**
   * Removes a movie from the user's list of favorites.
   * @param {string} movieId - The ID of the movie to remove.
   */
  removeFromFavorites(movieId: string): void {
    this.fetchApiData.deleteFavorite(movieId).subscribe({
      next: () => {
        this.snackBar.open('Movie removed from favorites.', 'OK', { duration: 3000 });
        this.loadUserProfile();
      },
      error: () => {
        this.snackBar.open('Failed to remove movie from favorites.', 'OK', { duration: 3000 });
      },
    });
  }

  /**
   * Adds or removes a movie from the user's favorites based on its current state.
   * @param {any} movie - The movie object to modify.
   */
  modifyFavoriteMovies(movie: any): void {
    if (this.user.FavoriteMovies?.includes(movie._id)) {
      this.removeFromFavorites(movie._id);
    } else {
      this.fetchApiData.addFavoriteMovie(movie._id).subscribe({
        next: () => {
          this.snackBar.open(`${movie.Title} added to favorites.`, 'OK', { duration: 3000 });
          this.loadUserProfile();
        },
        error: () => {
          this.snackBar.open('Failed to add movie to favorites.', 'OK', { duration: 3000 });
        },
      });
    }
  }

  /**
   * Navigates to the movies page.
   */
  goToMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Logs out the user and clears local storage.
   */
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }
}
