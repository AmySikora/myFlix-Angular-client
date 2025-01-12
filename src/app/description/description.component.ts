import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {
  movieTitle: string = '';
  movieDescription: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Retrieve query parameters
    this.route.queryParams.subscribe((params) => {
      this.movieTitle = params['title'] || 'Unknown Title';
      this.movieDescription = params['description'] || 'No description available.';
    });
  }

  goBack(): void {
    this.router.navigate(['/movies']); // Navigate back to movie cards
  }
}
