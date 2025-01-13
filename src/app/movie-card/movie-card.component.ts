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

  constructor(private fetchApiData: FetchApiDataService, private router: Router) {}

  ngOnInit(): void {
    this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
      this.movies = movies;
      this.filteredMovies = movies;
    });
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
}