import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';
import { Box } from '@mui/material';

function createData(name: string, isBillable: boolean, workHours: number, indirectHours: number, billableHours: number, inner: any) {
  return {
    name,
    isBillable,
    workHours,
    indirectHours,
    billableHours,
    inner
  };
}

const inner1 = [
  {
    id: '1',
    name: 'Employee 1',
    workHours: 10,
    indirectHours: 1
  },
  {
    id: '2',
    name: 'Employee 2',
    workHours: 10,
    indirectHours: 2.5
  }
];

const inner2 = [
  {
    id: '1',
    name: 'Employee 1',
    workHours: 50,
    indirectHours: 5
  },
  {
    id: '2',
    name: 'Employee 2',
    workHours: 30,
    indirectHours: 7.5
  }
];

export const GroupByProject = () => {
  const rows = [createData('Project 1', true, 20, 3.5, 23.5, inner1), createData('Project 2', true, 112.5, 12.5, 110, inner2)];

  const outerTableConfig = [
    {
      name: 'Projects',
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
      render: (row: any) => row.indirectHours
    },
    {
      name: 'Billable Hours',
      render: (row: any) => row.billableHours
    }
  ];

  const innerTableConfig = [
    {
      name: 'Name',
      render: (row: any) => row.name
    },
    {
      name: 'Work Hours',
      render: (row: any) => row.workHours
    },
    {
      name: 'Indirect Hours',
      render: (row: any) => row.indirectHours
    }
  ];

  return <CollapsibleTable rows={rows} outerTableConfig={outerTableConfig} innerTableConfig={innerTableConfig} innerTitle="Employee" />;
};
