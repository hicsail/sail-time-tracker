import { BarChart } from '@mui/x-charts';

export const Chart: React.FC = () => {
  const data = [
    {
      month: 'January',
      runningEstimate: 400,
      originalEstimate: 400
    },
    {
      month: 'February',
      runningEstimate: 350,
      originalEstimate: 400
    },
    {
      month: 'March',
      runningEstimate: 250,
      originalEstimate: 400
    },
    {
      month: 'April',
      runningEstimate: 150,
      originalEstimate: 400
    },
    {
      month: 'May',
      runningEstimate: 125,
      originalEstimate: 400
    },
    {
      month: 'June',
      runningEstimate: 120,
      originalEstimate: 400
    },
    {
      month: 'July',
      runningEstimate: 110,
      originalEstimate: 400
    },
    {
      month: 'August',
      runningEstimate: 100,
      originalEstimate: 400
    },
    {
      month: 'September',
      runningEstimate: 75,
      originalEstimate: 400
    },
    {
      month: 'October',
      runningEstimate: 80,
      originalEstimate: 400
    },
    {
      month: 'November',
      runningEstimate: 40,
      originalEstimate: 400
    },
    {
      month: 'December',
      runningEstimate: -20,
      originalEstimate: 400
    }
  ];

  return (
    <BarChart
      dataset={data}
      xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      series={[
        { dataKey: 'runningEstimate', label: 'Running Estimate'},
        { dataKey: 'originalEstimate', label: 'Original Estimate'}
      ]}
      width={500}
      height={300}
    />
  );
}
