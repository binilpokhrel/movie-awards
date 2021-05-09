import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { MovieDataService } from '../../../../core/services/movie-data.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent implements OnInit {
  searchIcon = faSearch;
  searchTerm = new FormControl('');
  private DEBOUNCE_INTERVAL = 750;

  constructor(
    private moviesService: MovieDataService
  ) { }

  ngOnInit() {
    this.searchTerm.valueChanges.pipe(
      debounceTime(this.DEBOUNCE_INTERVAL),
      map(movieTitle => movieTitle.trim()),
      distinctUntilChanged(),
      filter(movieTitle => !!movieTitle)
    ).subscribe(value => this.searchForMovie(value)); // TODO: worth converting to switchMap?
  }

  searchForMovie(value: string) {
    this.moviesService.searchByTitle(value);
  }
}
