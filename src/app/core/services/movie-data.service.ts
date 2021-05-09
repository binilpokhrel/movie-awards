import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MovieItem } from '../../shared/models/movie-item.model';
import { SearchResult, SearchResultConfig } from '../../shared/models/search-result.model';
import { CoreModule } from '../core.module';

@Injectable({
  providedIn: CoreModule
})
export class MovieDataService {

  private API_KEY = '6cd93de3';
  private SERVER_URL = 'http://www.omdbapi.com/' ;

  private searchResults$ = new ReplaySubject<MovieItem[]>(1);

  constructor(private httpClient: HttpClient) { }

  onResults() {
    return this.searchResults$.asObservable();
  }

  searchByTitle(title: string) {
    title = title.trim();

    const options = title ?
      { params: new HttpParams()
          .set('apikey', this.API_KEY)
          .set('s', title)
          .set('type', 'movie')
      } : {};

    return this.httpClient.get<SearchResultConfig>(this.SERVER_URL, options)
      .pipe(
        map(config => SearchResult.fromAPI(config)),
        catchError(this.handleError),
      )
      .subscribe(searchResults => {
        this.searchResults$.next(searchResults.movies);
      });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // client-side or network error
      console.error('An error occurred:', error.error);
    } else {
      console.error(`Backend returned code ${error.status} with body: ${error.error}`);
    }

    return throwError('We can\'t support that action right now. Please try again later.');
  }
}
