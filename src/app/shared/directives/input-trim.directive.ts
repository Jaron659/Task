import { Directive, ElementRef, inject } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

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
  private el = inject(ElementRef);
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.el.nativeElement.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const trimmed = (event.target as HTMLInputElement).value.trim();
    this.onChange(trimmed);
  }

  onBlur(): void {
    const trimmed = this.el.nativeElement.value.trim();
    this.el.nativeElement.value = trimmed;
    this.onChange(trimmed);
    this.onTouched();
  }
}
