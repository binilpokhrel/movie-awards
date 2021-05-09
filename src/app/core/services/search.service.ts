import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SearchResult, SearchResultConfig } from '../../shared/models/search-result.model';
import { CoreModule } from '../core.module';

@Injectable({
  providedIn: CoreModule
})
export class SearchService {

  private readonly API_KEY = '6cd93de3';
  private readonly SERVER_URL = 'http://www.omdbapi.com/' ;

  private currentTitle: string = '';
  private searchResults$ = new ReplaySubject<SearchResult>(1);

  constructor(private httpClient: HttpClient) { }

  onResults() {
    return this.searchResults$.asObservable();
  }

  searchByPage(page: number) {
    this.searchByTitle(this.currentTitle, page);
  }

  searchByTitle(title: string, page: number = 1) {
    this.currentTitle = title.trim();

    const options = this.currentTitle ?
      { params: new HttpParams()
          .set('apikey', this.API_KEY)
          .set('s', this.currentTitle)
          .set('type', 'movie')
          .set('page', page.toString())
      } : {};

    return this.httpClient.get<SearchResultConfig>(this.SERVER_URL, options)
      .pipe(
        map(config => SearchResult.fromAPI(config)),
        catchError(this.handleError),
      )
      .subscribe(searchResults => {
        this.searchResults$.next(searchResults);
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
