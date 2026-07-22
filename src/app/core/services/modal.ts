import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Modal {

visible = signal(false);

title = signal('');

message = signal('');

confirmButtonText = signal('Leave');

cancelButtonText = signal('Stay');



  private resolver?: (value: boolean) => void;

  confirm(
  title: string,
  message: string,
  confirmText: string = 'Leave',
  cancelText: string = 'Stay'
): Promise<boolean> {

    this.title.set(title);

    this.message.set(message);

    this.visible.set(true);

    this.confirmButtonText.set(confirmText);

    this.cancelButtonText.set(cancelText);

    return new Promise<boolean>((resolve) => {
        console.log('model response', resolve);
      this.resolver = resolve;

    });

  }

  confirmAction(): void {

 
    this.visible.set(false);

    this.resolver?.(true);


}

  cancelAction(): void {

    
  this.visible.set(false);

 this.resolver?.(false);



  }
}