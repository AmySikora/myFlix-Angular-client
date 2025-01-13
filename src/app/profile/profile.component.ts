import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  favoriteMovies: any[] = [];

  constructor(private fetchApiData: FetchApiDataService, private router: Router) {}

  ngOnInit(): void {
    this.getUserDetails();
  }
  goToMovies(): void {
    this.router.navigate(['movies'] )
  }

  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");
  }
  getUserDetails(): void {
    this.fetchApiData.getUser().subscribe({
      next: (response) => {
        this.user = response;
        this.favoriteMovies = response.FavoriteMovies;
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      },
    });
  }

  updateUserProfile(): void {
    this.fetchApiData.updateUser(this.user).subscribe({
      next: (response) => {
        alert('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.');
      },
    });
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account?')) {
      this.fetchApiData.deleteUser(this.user.Username).subscribe({
        next: () => {
          alert('Account deleted successfully.');
          localStorage.clear();
          this.router.navigate(['/welcome']);
        },
        error: (error) => {
          console.error('Error deleting account:', error);
          alert('Failed to delete account.');
        },
      });
    }
  }

  deleteFromFavorites(movieId: string): void {
    this.fetchApiData.deleteFavorite(movieId).subscribe({
      next: (response) => {
        alert('Movie deleted from favorites!');
        this.favoriteMovies = response.FavoriteMovies;
      },
      error: (error) => {
        console.error('Error removing movie from favorites:', error);
        alert('Failed to delete movie.');
      },
    });
  }
}
