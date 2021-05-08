import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faImage, faSearch, faStar, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { MovieDataService, MovieItem } from '../movie-data.service';

@Pipe({ name: 'titleYear' })
export class TitleYearPipe implements PipeTransform {
  transform(value: MovieItem): string {
    return `${value.title} (${value.year})`;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  searchIcon = faSearch;
  nominateIcon = farStar;
  nominatedIcon = faStar;
  imageIcon = faImage;
  movieItems: MovieItem[] = [];
  nominationList: { [index: string]: MovieItem } = {};
  get nominatedMovies(): MovieItem[] {
    return Object.values(this.nominationList);
  }

  isNominated(id: string): Boolean {
    return !!this.nominationList[id];
  }

  getNominationIcon(id: string): IconDefinition {
    return this.isNominated(id) ? this.nominatedIcon : this.nominateIcon;
  }

  disableNomination(id: string): Boolean {
    return this.nominatedMovies.length >= 5 || this.isNominated(id);
  }

  searchTerm = new FormControl('');

  private DEBOUNCE_INTERVAL = 750;

  constructor(
    private moviesService: MovieDataService,
    private changeDetector: ChangeDetectorRef
  ) { }

  // TODO: add `Showing X of Y results for: "{Movie}"` message to template
  // TODO: add pipe to truncate title

  ngOnInit(): void {
    this.searchTerm.valueChanges.pipe(
      debounceTime(this.DEBOUNCE_INTERVAL),
      map(movieTitle => movieTitle.trim()),
      distinctUntilChanged(),
      filter(movieTitle => !!movieTitle)
    ).subscribe(value => this.onSubmit(value)); // TODO: worth converting to switchMap?
    
    this.moviesService.onResults().subscribe(movies => {
      this.movieItems = movies;
      this.changeDetector.markForCheck();
    });
  }

  onSubmit(value: string) {
    this.moviesService.searchByTitle(value);
  }

  onNominate(movie: MovieItem) {
    if (!this.isNominated(movie.imdbID) && this.nominatedMovies.length < 5) {
      this.nominationList[movie.imdbID] = movie;
    }
  }

  onDelete(id: string) {
    delete this.nominationList[id];
  }
}
