import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NotificationItem } from 'src/app/shared/models/notification-item.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent implements OnInit {
  notifications: NotificationItem[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.notificationService.onUpdate().subscribe(notifications => {
      this.notifications = notifications;
      this.changeDetector.markForCheck();
    });
  }

  onDelete(id: number) {
    this.notificationService.remove(id);
  }

  trackById(index: number, item: NotificationItem) {
    return item.id;
  }
}
