import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyService } from '../services/my-service.service';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss']
})
export class GenreComponent implements OnInit {
  genreName: string = '';
  genreDescription: string = '';

  constructor(
    private route: ActivatedRoute,
    private myService: MyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.genreName = params['name'];
      if (this.genreName) {
        this.fetchGenreDetails(this.genreName);
      }
    });
  }

  fetchGenreDetails(name: string): void {
    this.myService.getGenreByName(name).subscribe((genre) => {
      this.genreDescription = genre?.Description || 'Description not available';
    });
  }

  goBack(): void {
    this.router.navigate(['/movies']);
  }
}
