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

  private readonly API_KEY = '6cd93de3';
  private readonly ITEMS_PER_PAGE = 10;
  private readonly SERVER_URL = 'http://www.omdbapi.com/' ;

  private currentTitle: string = '';
  private currentPage: number = 1;
  private searchResults$ = new ReplaySubject<MovieItem[]>(1);
  private totalResults: number = 0;

  constructor(private httpClient: HttpClient) { }

  nextPage() {
    if (this.currentTitle && this.currentPage * this.ITEMS_PER_PAGE < this.totalResults) {
      this.searchByTitle(this.currentTitle, this.currentPage + 1);
    }
  }

  onResults() {
    return this.searchResults$.asObservable();
  }

  previousPage() {
    if (this.currentTitle && this.currentPage > 1) {
      this.searchByTitle(this.currentTitle, this.currentPage - 1);
    }
  }

  searchByTitle(title: string, page: number = 1) {
    this.currentTitle = title.trim();
    this.currentPage = page;

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
        this.totalResults = searchResults.totalResults;
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
