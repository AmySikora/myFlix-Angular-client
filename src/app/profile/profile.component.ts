import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  editForm: FormGroup;
  user: any = {};
  favoriteMovies: any[] = [];

  constructor(
    private fetchApiData: FetchApiDataService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.formBuilder.group({
      Username: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Birthday: [''],
      Password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.snackBar.open('User data is missing. Please log in again.', 'OK', { duration: 3000 });
      this.router.navigate(['welcome']);
      return;
    }

    this.loadUserProfile();
  }

  loadUserProfile(): void {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  this.user = user;

  this.editForm.patchValue({
    Username: user.Username,
    Email: user.Email,
    Birthday: user.Birthday ? user.Birthday.split('T')[0] : '',
  });

  this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
    // Filter movies to only include those in FavoriteMovies
    this.favoriteMovies = movies.filter((movie) =>
      user.FavoriteMovies?.includes(movie._id)
    );
  });
}


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
        console.log('User updated:', res);
        this.snackBar.open('Profile updated successfully!', 'OK', { duration: 3000 });
        localStorage.setItem('user', JSON.stringify(res)); 
        this.loadUserProfile(); 
      },
      error: (err: any) => {
        console.error('Error updating profile:', err);
        this.snackBar.open('Failed to update profile. Please try again.', 'OK', { duration: 3000 });
      },
    });
  }
  

  fetchUserData(): void {
    this.fetchApiData.getUser().subscribe({
      next: (res: any) => {
        this.user = res;
        console.log('Fetched user data:', this.user);
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

  deleteAccount(): void {
    const username = this.user.Username; // Retrieve username from the user object

    this.fetchApiData.deleteUser(username).subscribe(
      () => {
        this.snackBar.open('Account deleted successfully.', 'OK', { duration: 3000 });
        localStorage.clear();
        this.router.navigate(['welcome']);
      },
      (err: any) => {
        console.error('Error deleting account:', err);
        this.snackBar.open('Failed to delete account.', 'OK', { duration: 3000 });
      }
    );
  }

  removeFromFavorites(movieId: string): void {
    this.fetchApiData.deleteFavorite(movieId).subscribe({
      next: () => {
        this.snackBar.open('Movie removed from favorites.', 'OK', { duration: 3000 });
        this.loadUserProfile(); 
      },
      error: (err: any) => {
        console.error('Error removing favorite:', err);
        this.snackBar.open('Failed to remove movie from favorites.', 'OK', { duration: 3000 });
      },
    });
  }
  
  modifyFavoriteMovies(movie: any): void {
  if (this.user.FavoriteMovies?.includes(movie._id)) {
    // Remove from favorites
    this.fetchApiData.deleteFavorite(movie._id).subscribe({
      next: (res: any) => {
        this.snackBar.open(`${movie.Title} removed from favorites.`, 'OK', { duration: 3000 });
        this.user.FavoriteMovies = res.FavoriteMovies;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.loadUserProfile(); // Refresh favorite movies
      },
      error: (err: any) => {
        console.error('Error removing favorite:', err);
        this.snackBar.open('Failed to remove movie from favorites.', 'OK', { duration: 3000 });
      },
    });
  } else {
    // Add to favorites
    this.fetchApiData.addFavoriteMovie(movie._id).subscribe({
      next: (res: any) => {
        this.snackBar.open(`${movie.Title} added to favorites.`, 'OK', { duration: 3000 });
        this.user.FavoriteMovies = res.FavoriteMovies;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.loadUserProfile(); // Refresh favorite movies
      },
      error: (err: any) => {
        console.error('Error adding favorite:', err);
        this.snackBar.open('Failed to add movie to favorites.', 'OK', { duration: 3000 });
      },
    });
  }
}

  goToMovies(): void {
    this.router.navigate(['movies']);
  }

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
  }
}
