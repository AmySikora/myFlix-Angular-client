import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { GenreComponent } from './genre/genre.component';
import { DirectorComponent } from './director/director.component';
import { DescriptionComponent } from './description/description.component';

const routes: Routes = [
   {path: 'welcome', component: WelcomePageComponent },
   {path: 'movies', component: MovieCardComponent},
   {path: 'genre', component: GenreComponent},
   {path: 'director', component: DirectorComponent},
   {path: 'description', component: DescriptionComponent},
   {path: '', redirectTo: '/movies', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
