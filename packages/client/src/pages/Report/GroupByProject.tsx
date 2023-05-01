import { CollapsibleTable } from '@pages/Report/components/CollapsibleTable';
import { Box } from '@mui/material';

function createData(name: string, isBillable: boolean, hours: number) {
  return {
    name,
    isBillable,
    hours,
    inner: [
      {
        id: '1',
        name: 'Employee 1',
        hours: 30,
        ratio: 0.89
      },
      {
        id: '2',
        name: 'Employee 2',
        hours: 10,
        ratio: 0.55
      }
    ]
  };
}

export const GroupByProject = () => {
  const rows = [
    createData('Project 1', true, 40),
    createData('Project 2', true, 9.0),
    createData('Project 3', false, 16.0),
    createData('Project 4', true, 3.7),
    createData('Project 5', true, 16.0)
  ];

  const outerHeaderRow = [
    {
      name: 'Projects'
    },
    {
      name: 'IsBillable'
    },
    {
      name: 'Hours'
    }
  ];

  const innerHeaderRow = [
    {
      name: 'Name'
    },
    {
      name: 'Hours'
    },
    {
      name: 'Ratio'
    }
  ];

  const rowsValuesConfigure = {
    outer: [
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
      }
    ],
    inner: [
      {
        value: (row: any) => row.name
      },
      {
        value: (row: any) => row.hours
      },
      {
        value: (row: any) => row.ratio
      }
    ]
  };
  return <CollapsibleTable rows={rows} outerHeaderRow={outerHeaderRow} innerHeaderRow={innerHeaderRow} rowsValuesConfigure={rowsValuesConfigure} />;
};
