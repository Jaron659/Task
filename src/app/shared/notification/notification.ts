import { Component, inject } from '@angular/core';
import { Notification } from '../../core/services/notification';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class NotificationComponent {
  notificationService = inject(Notification);
}
