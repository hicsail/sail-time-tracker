import { useGetHoursBreakdownActualQuery, useGetHoursBreakdownEstimateQuery } from '@graphql/burndown/burndown';
import { BarChart } from '@mui/x-charts';
import { Burndown } from '@graphql/graphql';
import { useState, useEffect } from 'react';

export interface ChartProps {
  projectId: string;
}

export const Chart: React.FC<ChartProps> = ({ projectId }) => {
  // Get the actual and estimates data for all time
  const actualQueryResults = useGetHoursBreakdownActualQuery({ variables: { projectId }});
  const estimateQueryResults = useGetHoursBreakdownEstimateQuery({ variables: { projectId }});

  const actualData = actualQueryResults.data ? actualQueryResults.data.getHoursBreakdownActual : [];
  const estimateData = estimateQueryResults.data ? estimateQueryResults.data.getHoursBreakdownEstimate: [];

  // Get the intitial total hours for the project
  const totalHours = 2000;

  const [runningEstimate, setRunningEstimate] = useState<Burndown[]>([]);
  const [originalEstimate, setOriginalEstimate] = useState<Burndown[]>([]);

  useEffect(() => {
    // If the data isn't available, don't do anything
    if (actualData.length == 0 || estimateData.length == 0) {
      setRunningEstimate([]);
      return;
    }

    if (actualData.length != estimateData.length) {
      throw new Error(`Expected actual and estimated data lengths to match, got ${actualData.length} and ${estimateData.length} respectively`);
    }

    // TODO: Handle potential differences in timezones
    const currentDate = new Date();


    // Go through all the values and determine the cooresponding number of remaining hours
    const estimateRemaining: Burndown[] = [];
    const originalEstimate: Burndown[] = [];
    let runningValue = totalHours;
    let estimateBurndown = totalHours;
    for (let index = 0; index < actualData.length; index++) {
      const startDate = actualData[index].startDate;
      const endDate = actualData[index].endDate;

      // If the current date is past the point where actual data is available, use estimate
      if (currentDate <= endDate) {
        runningValue -= actualData[index].hours;
      } else {
        runningValue -= estimateData[index].hours;
      }
      estimateRemaining.push({ startDate, endDate, hours: runningValue });

      // For the original estimate, keep using the estimated value
      estimateBurndown -= estimateData[index].hours;
      originalEstimate.push({ startDate, endDate, hours: estimateBurndown });
    }

    setRunningEstimate(estimateRemaining);
    setOriginalEstimate(originalEstimate);

  }, [actualQueryResults, estimateQueryResults]);

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
        { dataKey: 'runningEstimate', label: 'Running Estimate' },
        { dataKey: 'originalEstimate', label: 'Original Estimate' }
      ]}
      width={500}
      height={300}
    />
  );
};
