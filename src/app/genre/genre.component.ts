import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private myService: MyService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.genreName = params['name'];
      this.genreDescription = params['description']
    });
  }

  fetchGenreDetails(name: string): void {
    this.myService.getGenreByName(name).subscribe((genre) => {
      this.genreDescription = genre?.Description || 'Description not available';
    });
  }
}
