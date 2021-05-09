import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { faStar as farStar, IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faChevronRight, faImage, faStar } from '@fortawesome/free-solid-svg-icons';
import { MovieDataService } from '../../../../core/services/movie-data.service';
import { NominationService } from '../../../../core/services/nomination.service';
import { MovieItem } from '../../../../shared/models/movie-item.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultsComponent implements OnInit {
  currentPage = 1;
  movieItems: MovieItem[] = [];
  totalResults = 0;

  imageIcon = faImage;
  nextIcon = faChevronRight;
  previousIcon = faChevronLeft;
  nominatedIcon = faStar;
  nominateIcon = farStar;

  private readonly ITEMS_PER_PAGE = 10;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private moviesService: MovieDataService,
    private nominationService: NominationService
  ) { }

  getNominationIcon(id: string): IconDefinition {
    return this.nominationService.contains(id) ? this.nominatedIcon : this.nominateIcon;
  }

  ngOnInit() {
    this.moviesService.onResults().subscribe(results => {
      this.movieItems = results.movies;
      this.totalResults = results.totalResults;
      this.changeDetector.markForCheck();
    });
    this.nominationService.onUpdate().subscribe(nominations => {
      this.changeDetector.markForCheck();
    });
  }

  onClick(movie: MovieItem) {
    this.nominationService.add(movie);
  }

  onNext() {
    if (this.currentPage * this.ITEMS_PER_PAGE < this.totalResults) {
      this.currentPage++;
      this.moviesService.searchByPage(this.currentPage);
    }
  }

  onPrevious() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.moviesService.searchByPage(this.currentPage);
    }
  }

  shouldDisableNomination(id: string): Boolean {
    return this.nominationService.isFull() || this.nominationService.contains(id);
  }

  trackById(index: number, item: MovieItem) {
    return item.imdbID;
  }
}
