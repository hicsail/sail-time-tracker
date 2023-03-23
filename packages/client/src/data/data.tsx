export interface Data {
  name: string;
  hours: number;
  previousWeek: number;
  description: string;
}

export function createData(name: string, hours: number, previousWeek: number, description: string): Data {
  return {
    name,
    hours,
    previousWeek,
    description
  };
}
