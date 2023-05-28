export const formatHours = (value: number) => {
  const integer = Math.floor(value);
  let fractionalPart = value - integer;

  if (fractionalPart > 0 && fractionalPart <= 0.5) {
    return integer + 0.5;
  }

  if (fractionalPart > 0 && fractionalPart > 0.5) {
    return integer + 1;
  }

  return integer;
};
