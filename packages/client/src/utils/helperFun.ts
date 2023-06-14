import {format} from "date-fns";

export const formatUTCHours = (date: Date | undefined) => {
  if(date) {
    return date.setUTCHours(4, 0, 0, 0);
  }
  return null;
}

export const formatUTCDate = (date: Date) => {

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}

export const formatDate = (date: Date | undefined) => {
  if(date) {
    return format(date, "MM/dd/yyyy")
  }

  return null;
}

export const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});