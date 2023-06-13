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