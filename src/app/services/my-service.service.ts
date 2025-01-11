import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  constructor(private http: HttpClient) {}

  getGenreByName(name: string): Observable<any> {
    return this.http.get(`https://your-api-endpoint.com/genres?name=${name}`);
  }
}
