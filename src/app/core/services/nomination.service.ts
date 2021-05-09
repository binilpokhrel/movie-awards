import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MovieItem } from '../../shared/models/movie-item.model';
import { CoreModule } from '../core.module';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: CoreModule
})
export class NominationService {
  private CAPACITY = 5;
  private nominationList: { [index: string]: MovieItem } = {};
  private nominationList$ = new ReplaySubject<MovieItem[]>(1);
  private size = 0;

  constructor(private notificationService: NotificationService) { }

  add(item: MovieItem) {
    if (!this.isFull() && !this.contains(item.imdbID)) {
      this.nominationList[item.imdbID] = item;
      this.size++;
      this.nominationList$.next(this.getAll());
      if (this.isFull()) {
        this.notificationService.add(`You\'ve selected ${this.CAPACITY} nominations! You\'ve finished!`);
      }
    }
  }

  contains(id: string): Boolean {
    return !!this.nominationList[id];
  }

  getAll() {
    return Object.values(this.nominationList);
  }

  isFull(): Boolean {
    return this.size == this.CAPACITY;
  }

  onUpdate() {
    return this.nominationList$.asObservable();
  }
  
  remove(id: string) {
    delete this.nominationList[id];
    this.size--;
    this.nominationList$.next(this.getAll());
  }
}
