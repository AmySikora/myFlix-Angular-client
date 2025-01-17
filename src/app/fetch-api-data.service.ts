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

  /**
   * Registers a new user.
   * @param {Object} userDetails - User details object.
   * @returns {Observable<any>} Response from the server.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  /**
   * Logs in a user.
   * @param {Object} userDetails - User login details (username and password).
   * @returns {Observable<any>} Response containing the user and token.
   */
  public userLogin(userDetails: { Username: string; Password: string }): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      map((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves all movies.
   * @returns {Observable<any>} Array of all movies.
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves details of a specific movie.
   * @param {string} title - Title of the movie.
   * @returns {Observable<any>} Movie details.
   */
  public getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `movies/${title}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Adds a movie to the user's favorite list.
   * @param {string} movieId - ID of the movie to be added.
   * @returns {Observable<any>} Updated user data.
   */
  public addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.post(`${apiUrl}users/${user.Username}/movies/${movieId}`, null, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  /**
   * Removes a movie from the user's favorite list.
   * @param {string} movieId - ID of the movie to be removed.
   * @returns {Observable<any>} Updated user data.
   */
  public deleteFavorite(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(`${apiUrl}users/${user.Username}/movies/${movieId}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  /**
   * Retrieves user details.
   * @returns {Observable<any>} User data.
   */
  public getUser(): Observable<any> {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `users/${user}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Updates user details.
   * @param {string} username - Username of the user to update.
   * @param {Object} userData - Updated user details.
   * @returns {Observable<any>} Updated user data.
   */
  public updateUser(username: string, userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${apiUrl}users/${username}`, userData, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a user account.
   * @param {string} username - Username of the user to delete.
   * @returns {Observable<any>} Response from the server.
   */
  public deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + `users/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Extracts response data.
   * @private
   * @param {T} res - Response data.
   * @returns {T} The response data or an empty object.
   */
  private extractResponseData<T>(res: T): T {
    return res || ({} as T);
  }

  /**
   * Handles HTTP errors.
   * @private
   * @param {HttpErrorResponse} error - The error response.
   * @returns {Observable<never>} Throws an error.
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
