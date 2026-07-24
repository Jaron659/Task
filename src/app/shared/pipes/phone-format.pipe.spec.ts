import { PhoneFormatPipe } from './phone-format.pipe';

describe('PhoneFormatPipe', () => {
  const pipe = new PhoneFormatPipe();

  it('formats a 10-digit phone number', () => {
    expect(pipe.transform('9345384003')).toBe('(934) 538-4003');
  });

  it('formats a 12-digit Indian phone number', () => {
    expect(pipe.transform('919345384003')).toBe('+91 (934) 538-4003');
  });

  it('returns unsupported values unchanged', () => {
    expect(pipe.transform('12345')).toBe('12345');
  });
});
