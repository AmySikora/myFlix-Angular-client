import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.scss']
})
export class DirectorComponent implements OnInit {
  directorName: string = '';
  directorBio: string = '';
  directorBirthYear: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Get the director details from query parameters
    this.route.queryParams.subscribe((params) => {
      this.directorName = params['name'] || 'Unknown';
      this.directorBio = params['bio'] || 'Biography not available';
      this.directorBirthYear = params['birthYear'] || 'Birth year not available';
    });
  }

  goBack(): void {
    this.router.navigate(['/movies']); // Navigate back to the movies list
  }
}
