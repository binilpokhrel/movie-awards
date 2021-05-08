import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faImage, faSearch, faStar } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { MovieDataService, MovieItem } from '../movie-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  searchIcon = faSearch;
  nominateIcon = faStar;
  imageIcon = faImage;
  movieItems: MovieItem[] = [];

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
}
