import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phoneFormat', standalone: true })
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    const digits = value.replace(/\D/g, '');

    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    if (digits.length === 12 && digits.startsWith('91')) {
      return `+91 (${digits.slice(2, 5)}) ${digits.slice(5, 8)}-${digits.slice(8)}`;
    }

    return value;
  }
}
