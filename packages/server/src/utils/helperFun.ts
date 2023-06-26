import { format } from 'date-fns';

export const getTotalIndirectHours = (data) => {
  const result = data.filter((data) => data.name === 'Indirect').map((indirect) => indirect.records.reduce((sum, currentValue) => sum + currentValue.hours, 0));
  return result[0];
};

export const getTotalWorkHours = (data) => {
  return data
    .filter((project) => project.name !== 'Indirect' && project.name !== 'Absence' && project.records.length > 0)
    .map((project) => {
      return project.records.reduce((sum, currentValue) => currentValue.hours + sum, 0);
    })
    .reduce((sum, currentValue) => sum + currentValue, 0);
};

export const formatHours = (value: number) => {
  const integer = Math.floor(value);
  const fractionalPart = value - integer;

  if (fractionalPart > 0 && fractionalPart <= 0.5) {
    return integer + 0.5;
  }

  if (fractionalPart > 0 && fractionalPart > 0.5) {
    return integer + 1;
  }

  return integer;
};

export const formatPercentage = (value: number) => {
  return (value * 100).toFixed(1);
};

export const convertToUTCDate = (utcDate: Date) => {
  return new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate(), utcDate.getUTCHours(), utcDate.getUTCMinutes(), utcDate.getUTCSeconds());
};

export const formatDateToDashFormat = (date: Date | undefined) => {
  if (date) {
    return format(date, 'MM-dd-yyyy');
  }

  return 'invalid date';
};
