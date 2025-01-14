import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  filteredMovies: any[] = [];
  searchQuery: string = '';
  user: any = {}; // Add this property

  constructor(private fetchApiData: FetchApiDataService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserData(); // Load user data
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

  goToGenre(genre: any): void {
    this.router.navigate(['genre'], {
      queryParams: {
        name: genre.Name,
        description: genre.Description,
      },
    });
  }

  goToDirector(director: any): void {
    this.router.navigate(['director'], {
      queryParams: {
        name: director.Name,
        bio: director.Bio,
        birth: director.Birth,
        death: director.Death || '',
      },
    });
  }

  goToDescription(movie: any): void {
    this.router.navigate(['description'], {
      queryParams: {
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
