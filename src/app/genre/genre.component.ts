import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.genreName = params['name'] || 'No genre name provided';
      this.genreDescription = params['description'] || 'No description available';
    });
  }

  goBack(): void {
    this.router.navigate(['/movies']);
  }
}