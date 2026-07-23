import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

@Directive({ selector: '[appAutoFocus]', standalone: true })
export class AutoFocusDirective {
  private el = inject(ElementRef);

  constructor() {
    afterNextRender(() => {
      this.el.nativeElement.focus();
    });
  }
}
