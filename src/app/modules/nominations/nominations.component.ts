import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NominationService } from '../../core/services/nomination.service';
import { MovieItem } from '../../shared/models/movie-item.model';

@Component({
  selector: 'app-nominations',
  templateUrl: './nominations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NominationsComponent implements OnInit {
  nominatedMovies: MovieItem[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private nominationService: NominationService
  ) { }

  ngOnInit() {
    this.nominationService.onUpdate().subscribe(nominations => {
      console.log('update ran');
      this.nominatedMovies = nominations;
      this.changeDetector.markForCheck();
    })
  }

  onDelete(id: string) {
    this.nominationService.remove(id);
  }
}
