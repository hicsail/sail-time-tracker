import { useGetHoursBreakdownActualQuery, useGetHoursBreakdownEstimateQuery } from '@graphql/burndown/burndown';
import { BarChart } from '@mui/x-charts';
import { Burndown } from '@graphql/graphql';
import { useState, useEffect } from 'react';

interface ChartData {
  date: Date,
  runningEstimate: number;
  originalEstimate: number;
}

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

  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    // If the data isn't available, don't do anything
    if (actualData.length == 0 || estimateData.length == 0) {
      setChartData([]);
      return;
    }

    if (actualData.length != estimateData.length) {
      throw new Error(`Expected actual and estimated data lengths to match, got ${actualData.length} and ${estimateData.length} respectively`);
    }

    // TODO: Handle potential differences in timezones
    const currentDate = new Date();


    // Go through all the values and determine the cooresponding number of remaining hours
    let runningValue = totalHours;
    let estimateBurndown = totalHours;
    const newChartData: ChartData[] = [];
    for (let index = 0; index < actualData.length; index++) {
      const startDate = actualData[index].startDate;
      const endDate = actualData[index].endDate;

      // If the current date is past the point where actual data is available, use estimate
      if (currentDate <= endDate) {
        runningValue -= actualData[index].hours;
      } else {
        runningValue -= estimateData[index].hours;
      }

      // For the original estimate, keep using the estimated value
      estimateBurndown -= estimateData[index].hours;

      newChartData.push({ date: startDate, runningEstimate: runningValue, originalEstimate: estimateBurndown });
    }

    setChartData(newChartData);
  }, [actualQueryResults, estimateQueryResults]);

  return (
    <BarChart
      dataset={chartData as any[]}
      xAxis={[{ scaleType: 'band', dataKey: 'date' }]}
      series={[
        { dataKey: 'runningEstimate', label: 'Running Estimate' },
        { dataKey: 'originalEstimate', label: 'Original Estimate' }
      ]}
      width={1000}
      height={300}
    />
  );
};
