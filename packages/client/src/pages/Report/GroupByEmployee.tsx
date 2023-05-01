import { CollapsibleTable } from '@pages/Report/components/CollapsibleTable';
import { Box } from '@mui/material';
import * as React from 'react';

const createData = (name: string, workHours: number, indirectHours: number, billableHours: number, ratio: number) => {
  return {
    name,
    workHours,
    indirectHours,
    billableHours,
    ratio,
    inner: [
      {
        id: '1',
        name: 'Project 1',
        isBillable: true,
        rate: 0.89,
        hours: 3
      },
      {
        id: '2',
        name: 'Project 2',
        isBillable: false,
        rate: 0.89,
        hours: 10
      }
    ]
  };
};

export const GroupByEmployee = () => {
  const rows = [
    createData('Employee 1', 60, 6, 66, 10),
    createData('Employee 2', 237, 9.0, 4.3, 0.23),
    createData('Employee 3', 262, 16.0, 24, 0.15),
    createData('Employee 4', 305, 3.7, 67, 0.76),
    createData('Employee 5', 356, 16.0, 49, 0.34)
  ];

  const outerHeaderRow = [
    {
      name: 'Employees'
    },
    {
      name: 'Work Hours',
      align: 'right'
    },
    {
      name: 'Indirect Hours',
      align: 'right'
    },
    {
      name: 'Billable Hours (Work + Indirect)',
      align: 'right'
    },
    {
      name: 'Ratio (Work / Indirect)',
      align: 'right'
    }
  ];

  const innerHeaderRow = [
    {
      name: 'Name'
    },
    {
      name: 'IsBillable'
    },
    {
      name: 'Hours'
    },
    {
      name: 'Rate',
      align: 'right'
    }
  ];

  const rowsValuesConfigure = {
    outer: [
      {
        value: (row: any) => row.name
      },
      {
        value: (row: any) => row.workHours
      },
      {
        value: (row: any) => row.indirectHours
      },
      {
        value: (row: any) => row.billableHours
      },
      {
        value: (row: any) => row.ratio
      }
    ],
    inner: [
      {
        value: (row: any) => row.name
      },
      {
        value: (row: any) => {
          return (
            <Box
              sx={row.isBillable ? { backgroundColor: 'rgb(250, 236,204)' } : { backgroundColor: 'rgb(250, 227,222)' }}
              width={40}
              height={20}
              textAlign="center"
              borderRadius="3px"
            >
              {row.isBillable.toString()}
            </Box>
          );
        }
      },
      {
        value: (row: any) => row.hours
      },
      {
        value: (row: any) => row.rate,
        align: 'right'
      }
    ]
  };
  return <CollapsibleTable rows={rows} outerHeaderRow={outerHeaderRow} innerHeaderRow={innerHeaderRow} rowsValuesConfigure={rowsValuesConfigure} />;
};
