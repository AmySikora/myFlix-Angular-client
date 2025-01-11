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

  constructor(private fetchApiData: FetchApiDataService, private router: Router) {}

  ngOnInit(): void {
    this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
      this.movies = movies;
    });
  }

  goToGenre(genre: any): void {
    this.router.navigate(['genre'], { queryParams: { name: genre.Name } });
    this.router.navigate(['genre'], { queryParams: { description: genre.Description }});
  }

  goToDirector(director: any): void {
    this.router.navigate(['director'], { queryParams: { name: director.Name } });
  }

  goToDescription(movie: any): void {
    this.router.navigate(['description'], { queryParams: { id: movie._id } });
  }
}
