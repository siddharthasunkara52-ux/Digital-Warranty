import {
  getDaysUntilExpiry,
  getExpiresInText,
  getWarrantyProgress,
  toInputDate,
} from './dateUtils';

describe('dateUtils', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-25T10:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('calculates day offsets at date granularity', () => {
    expect(getDaysUntilExpiry('2026-04-25')).toBe(0);
    expect(getDaysUntilExpiry('2026-04-26')).toBe(1);
    expect(getDaysUntilExpiry('2026-04-24')).toBe(-1);
  });

  test('returns user-facing expiry text for common states', () => {
    expect(getExpiresInText('2026-04-24')).toBe('Expired yesterday');
    expect(getExpiresInText('2026-04-25')).toBe('Expires today');
    expect(getExpiresInText('2026-04-26')).toBe('Expires tomorrow');
    expect(getExpiresInText('2026-04-30')).toBe('Expires in 5 days');
  });

  test('bounds warranty progress before purchase and after expiry', () => {
    expect(getWarrantyProgress('2026-04-26', '2026-05-26')).toBe(0);
    expect(getWarrantyProgress('2026-03-01', '2026-04-01')).toBe(100);
  });

  test('formats a value for date inputs', () => {
    expect(toInputDate('2026-04-25T12:30:00.000Z')).toBe('2026-04-25');
    expect(toInputDate()).toBe('');
  });
});
