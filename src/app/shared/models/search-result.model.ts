import { MovieItem } from "./movie-item.model";

export interface SearchResultConfig {
  Response: 'True' | 'False',
  Search?: Array<Object>,
  totalResults?: string,
  error?: string
}

export class SearchResult {
  constructor(
    public movies: MovieItem[],
    public page: number,
    public totalResults: number,
    public error: boolean
  ) {
    Object.keys(this).forEach(key => {
      if (this[key as keyof SearchResult] === undefined) {
        delete this[key as keyof SearchResult];
      }
    })
  }

  static fromAPI(config: SearchResultConfig, page = 1): SearchResult {
    return new SearchResult(
      config.Search ? config.Search?.map(movie => MovieItem.fromAPI(<any>movie)) : [],
      page,
      config.totalResults ? Number(config.totalResults) : 0,
      config.Response == "False" || !!config.error
    )
  }
}
