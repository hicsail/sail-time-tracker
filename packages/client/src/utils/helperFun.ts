import { addDays, format, startOfWeek } from 'date-fns';

export const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export const convertToUTCDate = (date: Date | undefined) => {
  if (date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  }

  return undefined;
};

export const formatDateToForwardSlashFormat = (date: Date | undefined): string => {
  if (date) {
    return format(date, 'MM/dd/yyyy');
  }
  return 'No date provided';
};

export const formatDateToDashFormat = (date: Date | undefined) => {
  if (date) {
    return format(date, 'MM-dd-yyyy');
  }

  return undefined;
};

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
