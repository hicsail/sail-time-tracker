import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';
import { Box } from '@mui/material';
import * as React from 'react';

const createData = (name: string, workHours: number, indirectHours: number, billableHours: number, inner: any) => {
  return {
    name,
    workHours,
    indirectHours,
    billableHours,
    inner
  };
};

const inner1 = [
  {
    id: '1',
    name: 'Project 1',
    isBillable: true,
    workHours: 10,
    indirectHours: 1
  },
  {
    id: '2',
    name: 'Project 2',
    isBillable: false,
    workHours: 50,
    indirectHours: 5
  }
];

const inner2 = [
  {
    id: '1',
    name: 'Project 1',
    isBillable: true,
    workHours: 10,
    indirectHours: 2.5
  },
  {
    id: '2',
    name: 'Project 2',
    isBillable: false,
    workHours: 30,
    indirectHours: 7.5
  }
];

export const GroupByEmployee = () => {
  const rows = [createData('Employee 1', 60, 6, 66, inner1), createData('Employee 2', 40, 10, 50, inner2)];

  const outerTableConfig = [
    {
      name: 'Employees',
      render: (row: any) => row.name
    },
    {
      name: 'Work Hours',
      render: (row: any) => row.workHours
    },
    {
      name: 'Indirect Hours',
      render: (row: any) => row.indirectHours
    },
    {
      name: 'Billable Hours (Work + Indirect)',
      render: (row: any) => row.billableHours
    }
  ];

  const innerTableConfig = [
    {
      name: 'Name',
      render: (row: any) => row.name
    },
    {
      name: 'IsBillable',
      render: (row: any) => {
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
      name: 'Work Hours',
      render: (row: any) => row.workHours
    },
    {
      name: 'Indirect Hours',
      render: (row: any) => row.indirectHours,
      align: 'right'
    }
  ];

  return <CollapsibleTable rows={rows} outerTableConfig={outerTableConfig} innerTableConfig={innerTableConfig} innerTitle="Project" />;
};
