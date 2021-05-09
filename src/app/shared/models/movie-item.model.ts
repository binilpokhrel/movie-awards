interface MovieItemConfig {
  Title: string,
  Year: string,
  imdbID: string,
  Poster: string,
  Type: string
}

export class MovieItem {
  constructor(
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
