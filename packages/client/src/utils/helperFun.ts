import { addDays, format, startOfWeek } from 'date-fns';

export const formatUTCHours = (date: Date | undefined) => {
  if (date) {
    return date.setUTCHours(4, 0, 0, 0);
  }
  return null;
};

export const formatUTCDate = (date: Date) => {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
};

export const formatEstToUtcDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const formatDate = (date: Date | undefined): string => {
  if (date) {
    return format(date, 'MM/dd/yyyy');
  }
  return 'No date provided';
};

export const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export const getMondayToSundayDates = (date: Date) => {
  const monday = startOfWeek(date, { weekStartsOn: 1 }); // Monday as the start of the week

  // Create an array to store the dates
  const dates = [];

  // Generate dates from Monday to Sunday
  for (let i = 0; i < 7; i++) {
    const date = addDays(monday, i);
    dates.push({ dateOfMonth: format(date, 'd'), dateOfWeek: format(date, 'EEE'), date: format(date, 'MM-dd-yyyy') });
  }

  return dates;
};

export const formatDateToDashFormat = (date: Date | undefined) => {
  if (date) {
    return format(date, 'MM-dd-yyyy');
  }

  return 'invalid date';
};
