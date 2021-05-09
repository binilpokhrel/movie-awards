import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { NotificationItem } from '../../shared/models/notification-item.model';
import { CoreModule } from '../core.module';

@Injectable({
  providedIn: CoreModule
})
export class NotificationService {
  private CAPACITY = 5;
  private id = 0;
  private notificationList: { [index: number]: NotificationItem } = {};
  private notificationList$ = new ReplaySubject<NotificationItem[]>(1);
  private size = 0;

  constructor() { }

  add(item: string) {
    if (!this.isFull()) {
      this.notificationList[++this.id] = {
        id: this.id,
        message: item
      };
      this.size++;
      this.notificationList$.next(this.getAll());
    }
  }

  contains(id: number): Boolean {
    return !!this.notificationList[id];
  }

  getAll() {
    return Object.values(this.notificationList);
  }

  isFull(): Boolean {
    return this.size == this.CAPACITY;
  }

  onUpdate() {
    return this.notificationList$.asObservable();
  }
  
  remove(id: number) {
    delete this.notificationList[id];
    this.size--;
    this.notificationList$.next(this.getAll());
  }
}
