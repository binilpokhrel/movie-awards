import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface MovieItemConfig {
  Title: string,
  Year: string,
  imdbID: string,
  Poster: string,
  Type: string
}

export class MovieItem {
  constructor (
    public title: string,
    public year: string,
    public imdbID: string,
    public poster: string
  ) {
    Object.keys(this).forEach(key => {
      if (this[key as keyof MovieItem] === undefined) {
        delete this[key as keyof MovieItem];
      }
    })
  }

  static fromAPI(config: MovieItemConfig): MovieItem {
    return new MovieItem(
      config.Title,
      config.Year,
      config.imdbID,
      config.Poster
    )
  }
}

interface SearchResultConfig {
  Response: 'True' | 'False',
  Search?: Array<Object>,
  totalResults?: string,
  error?: string
}

export class SearchResult {

  constructor(
    public movies: MovieItem[],
    public totalResults: number,
    public error: boolean
  ) {
    Object.keys(this).forEach(key => {
      if (this[key as keyof SearchResult]=== undefined) {
        delete this[key as keyof SearchResult];
      }
    })
  } 

  static fromAPI(config: SearchResultConfig): SearchResult {
    return new SearchResult(
      config.Search ? config.Search?.map(movie => MovieItem.fromAPI(<any>movie)) : [],
      config.totalResults ? Number(config.totalResults) : 0,
      config.Response == "False" || !!config.error
    )
  }
}

@Injectable({
  providedIn: 'root'
})
export class MovieDataService {

  private API_KEY = '6cd93de3';
  private SERVER_URL = 'http://www.omdbapi.com/' ;

  private searchResults = new ReplaySubject<MovieItem[]>(1);

  constructor(private httpClient: HttpClient) { }

  onResults() {
    return this.searchResults.asObservable();
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
        this.searchResults.next(searchResults.movies);
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
