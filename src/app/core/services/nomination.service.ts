import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MovieItem } from '../../shared/models/movie-item.model';
import { CoreModule } from '../core.module';

@Injectable({
  providedIn: CoreModule
})
export class NominationService {

  private CAPACITY = 5;
  private nominationList: { [index: string]: MovieItem } = {};
  private size = 0;

  private nominationList$ = new ReplaySubject<MovieItem[]>(1);

  constructor() { }

  add(item: MovieItem) {
    if (!this.isFull() || !this.contains(item.imdbID)) {
      this.nominationList[item.imdbID] = item;
      this.size++;
      this.nominationList$.next(this.getAll());
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
