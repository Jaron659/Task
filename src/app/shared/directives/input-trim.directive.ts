import {
  Directive,
  ElementRef,
  HostListener,
  inject
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Directive({
  selector: '[appInputTrim]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputTrimDirective,
      multi: true,
    },
  ],
})
export class InputTrimDirective implements ControlValueAccessor {
  private el = inject(ElementRef<HTMLInputElement>);

  private onChange = (_: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.el.nativeElement.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }

  @HostListener('blur')
  onBlur(): void {
    const trimmed = this.el.nativeElement.value.trim();

    this.el.nativeElement.value = trimmed;

    this.onChange(trimmed);
    this.onTouched();
  }
}