/**
 * Formatting utilities for dates, currency, and other data types
 */

/**
 * Currency formatter for USD
 */
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

/**
 * Formats a number as US dollar currency
 */
export const formatToDollar = (n: number): string =>
  currencyFormatter.format(n);

/**
 * Creates a currency formatter for any locale and currency
 */
export const createCurrencyFormatter = (locale: string, currency: string) => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
  return (n: number): string => formatter.format(n);
};

/**
 * Generates a random date between two dates
 */
export const getRandomDate = (start: Date, end: Date): Date =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

/**
 * Formats a date using Intl.DateTimeFormat
 */
export const formatDate = (
  date: Date,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {},
): string => {
  return new Intl.DateTimeFormat(locale, options).format(date);
};

/**
 * Returns relative time string (e.g., "2 hours ago", "in 3 days")
 */
export const getRelativeTime = (
  date: Date,
  locale: string = 'en-US',
): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const units: Array<[string, number]> = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];

  for (const [unit, secondsInUnit] of units) {
    const interval = Math.floor(Math.abs(diffInSeconds) / secondsInUnit);
    if (interval >= 1) {
      return rtf.format(
        diffInSeconds < 0 ? -interval : interval,
        unit as Intl.RelativeTimeFormatUnit,
      );
    }
  }

  return rtf.format(0, 'second');
};
