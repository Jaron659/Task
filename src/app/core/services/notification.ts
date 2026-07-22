import { Injectable, signal } from '@angular/core';

export interface NotificationMessage {
  id: number;
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class Notification {
  notifications = signal<NotificationMessage[]>([]);

  private counter = 0;

  show(
    message: string,
    type: NotificationMessage['type'] = 'error',
    duration = 5000,
  ): void {
    const id = ++this.counter;
    this.notifications.update((n) => [...n, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  showError(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  showSuccess(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  showWarning(message: string, duration = 4000): void {
    this.show(message, 'warning', duration);
  }

  showInfo(message: string, duration = 4000): void {
    this.show(message, 'info', duration);
  }

  dismiss(id: number): void {
    this.notifications.update((n) => n.filter((notif) => notif.id !== id));
  }
}
