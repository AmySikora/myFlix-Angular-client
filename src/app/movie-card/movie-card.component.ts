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

  goToProfile(): void {
    this.router.navigate(['profile'] )
  }

  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");
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
    this.fetchApiData.getAllMovies().subscribe(res => {
        this.movies = res;

        let user = JSON.parse(localStorage.getItem("user") || "");
        this.movies.forEach((movie: any) => {
            movie.isFavorite = user.favoriteMovies.includes(movie._id);
        })
        return this.movies;
    }, err => {
        console.error(err)
    })
  }

  modifyFavoriteMovies(movie: any): void {
    let user = JSON.parse(localStorage.getItem("user") || "");
    let icon = document.getElementById(`${movie._id}-favorite-icon`);

    if (user.favoriteMovies.includes(movie._id)) {
        this.fetchApiData.deleteFavorite(movie.id).subscribe(res => {
            icon?.setAttribute("fontIcon", "favorite_border");

            console.log("deletion successfull")
            console.log(res);
            user.favoriteMovies = res.favoriteMovies;
            localStorage.setItem("user", JSON.stringify(user));
        }, err => {
            console.error(err)
        })
  } else {
    this.fetchApiData.addFavoriteMovie(user.id, movie.title).subscribe(res => {
        icon?.setAttribute("fontIcon", "favorite");

        console.log("successfully added")
        console.log(res);
        user.favoriteMovies = res.favoriteMovies;
        localStorage.setItem("user", JSON.stringify(user));
    }, err => {
        console.error(err)
    })
}
localStorage.setItem("user", JSON.stringify(user));
}

}