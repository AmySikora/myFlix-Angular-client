import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Declaring the API URL that will provide data for the client app
const apiUrl = 'https://myflixmovies123-d3669f5b95da.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})

export class FetchApiDataService {
  constructor(private http: HttpClient) {}


  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
  }  

  // 1. User registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(`${apiUrl}users`, userDetails)
      .pipe(map(this.extractResponseData) ,catchError(this.handleError));
  }

  // 2. User login endpoint
  public userLogin(Username: string, Password: string): Observable<any> {
    const userDetails = { Username, Password };

    return this.http
      .post(`${apiUrl}login`, userDetails)
      .pipe(
        map((response: any) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  // 3. Get all movies endpoint
  public getAllMovies(): Observable<any> {
    return this.http
      .get(`{apiUrl}movies`, {headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // 4. Get one movie endpoint
  public getOneMovie(title: string): Observable<any> {
    return this.http
      .get(`${apiUrl}movies/${title}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // 5. Get director endpoint
  public getDirector(name: string): Observable<any> {
    return this.http
    .get(`${apiUrl}movies/director/${name}`, {
      headers: this.getAuthHeaders(),
      })
    .pipe(map(this.extractResponseData),catchError(this.handleError));
  }

  // 6. Get genre endpoint
  public getGenre(name: string): Observable<any> {
    return this.http
      .get(`${apiUrl}movies/genre/${name}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // 7. Get user endpoint
  public getUser(name: string): Observable<any> {
    return this.http
    .get(`${apiUrl}users/${name}`, {
      headers: this.getAuthHeaders(),
    })
    .pipe(map(this.extractResponseData),catchError(this.handleError));
  }

  // 8. Add favorite movie endpoint
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .post(`${apiUrl}users/${username}/movies/${movieId}`, {}, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // 9. Edit user info endpoint
  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http
      .put(`${apiUrl}users/${username}`, userDetails, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // 10. Delete user endpoint
  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(`${apiUrl}users/${username}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // 11. Delete a movie from favorites endpoint
  public deleteFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .delete(`${apiUrl}users/${username}/movies/${movieId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    return res || {};
  }

  // Error handler
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}

