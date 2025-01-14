import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  filteredMovies: any[] = [];
  searchQuery: string = '';
  user: any = {};

  constructor(
    private fetchApiData: FetchApiDataService, 
    private dialog: MatDialog,
    private router: Router) {}

  ngOnInit(): void {
    this.loadUserData(); 
    this.getMovies();
  }

  loadUserData(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredMovies = this.movies;
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredMovies = this.movies.filter((movie) =>
      movie.Title.toLowerCase().includes(query) ||
      movie.Director.Name.toLowerCase().includes(query) ||
      movie.Genre.Name.toLowerCase().includes(query)
    );
  }

  goToProfile(): void {
    this.router.navigate(['profile']);
  }

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
  }

  showGenre(movie: any): void {
    this.dialog.open(InfoDialogComponent, {
      data: {
        title: String(movie.genre.type).toUpperCase(),
        content: movie.Genre.description
      },
      width: '400px',
    });
  }

  showDirector(movie: any): void {
    this.dialog.open(InfoDialogComponent, {
      data: {
        title: movie.Director.Name,
        bio: movie.Director.Bio,
        birth: movie.Director.Birth,
        death: movie.Director.Death || '',
      },
    });
  }

  showDescription(movie: any): void {
    this.dialog.open(InfoDialogComponent, {
      data: {
        title: movie.Title,
        description: movie.Description,
      },
    });
  }

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
