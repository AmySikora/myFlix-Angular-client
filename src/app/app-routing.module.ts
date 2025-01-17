/**
 * Manages the application routes, linking components to specific paths.
 * Provides navigation between different views of the application.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { GenreComponent } from './genre/genre.component';
import { DirectorComponent } from './director/director.component';
import { DescriptionComponent } from './description/description.component';

/**
 * Defines the application routes.
 * Each route associates a path with a component.
 */
const routes: Routes = [
  /**
   * Route for the welcome page.
   * Path: '/welcome'
   * Component: `WelcomePageComponent`
   */
  { path: 'welcome', component: WelcomePageComponent },

  /**
   * Route for displaying movie cards.
   * Path: '/movies'
   * Component: `MovieCardComponent`
   */
  { path: 'movies', component: MovieCardComponent },

  /**
   * Route for displaying genre details.
   * Path: '/genre'
   * Component: `GenreComponent`
   */
  { path: 'genre', component: GenreComponent },

  /**
   * Route for displaying director details.
   * Path: '/director'
   * Component: `DirectorComponent`
   */
  { path: 'director', component: DirectorComponent },

  /**
   * Route for displaying movie descriptions.
   * Path: '/description'
   * Component: `DescriptionComponent`
   */
  { path: 'description', component: DescriptionComponent },

  /**
   * Redirects the default path ('') to the movies page ('/movies').
   */
  { path: '', redirectTo: '/movies', pathMatch: 'full' },
];

@NgModule({
  /**
   * Imports the RouterModule with the defined routes.
   */
  imports: [RouterModule.forRoot(routes)],

  /**
   * Exports the RouterModule to make it available throughout the app.
   */
  exports: [RouterModule],
})
export class AppRoutingModule {}
