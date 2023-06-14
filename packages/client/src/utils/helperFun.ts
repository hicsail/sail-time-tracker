import {format} from "date-fns";

export const formatUTCHours = (date: Date) => {
  return date.setUTCHours(4, 0, 0, 0);
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

export const formatDate = (date: Date) => {
  return format(date, "MM/dd/yyyy")
}

export const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});