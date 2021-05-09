import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { faStar as farStar, IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { faImage, faStar } from '@fortawesome/free-solid-svg-icons';
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
  movieItems: MovieItem[] = [];

  imageIcon = faImage;
  nominatedIcon = faStar;
  nominateIcon = farStar;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private moviesService: MovieDataService,
    private nominationService: NominationService
  ) { }

  getNominationIcon(id: string): IconDefinition {
    return this.nominationService.contains(id) ? this.nominatedIcon : this.nominateIcon;
  }

  // TODO: add `Showing X of Y results for: "{Movie}"` message to template
  // TODO: add pipe to truncate title

  ngOnInit() {
    this.moviesService.onResults().subscribe(movies => {
      this.movieItems = movies;
      this.changeDetector.markForCheck();
    });
    this.nominationService.onUpdate().subscribe(nominations => {
      this.changeDetector.markForCheck();
    })
  }

  onClick(movie: MovieItem) {
    this.nominationService.add(movie);
  }

  shouldDisableNomination(id: string): Boolean {
    return this.nominationService.isFull() || this.nominationService.contains(id);
  }
}
