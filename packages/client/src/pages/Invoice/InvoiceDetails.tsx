import { Box, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';

export const InvoiceDetails = () => {
  const { id } = useParams();

  const rows: any[] = [
    {
      name: 'Project 1',
      scheduledValue: 10000,
      previousBilling: 3000,
      currentPeriodWork: 1000,
      totalCompleted: 4000,
      remainingBalance: 6000,
      inner: [
        {
          name: 'Employee 1',
          rate: 45,
          workHours: 15,
          gross: 675
        },
        {
          name: 'Employee 2',
          rate: 50,
          workHours: 6.5,
          gross: 325
        }
      ]
    },
    {
      name: 'Project 2',
      scheduledValue: 20000,
      previousBilling: 3000,
      currentPeriodWork: 1000,
      totalCompleted: 4000,
      remainingBalance: 16000,
      inner: [
        {
          name: 'Employee 1',
          rate: 45,
          workHours: 15,
          gross: 675
        },
        {
          name: 'Employee 2',
          rate: 50,
          workHours: 6.5,
          gross: 325
        }
      ]
    }
  ];

  // outer table column name and render config
  const outerTableConfig = [
    {
      name: 'Projects',
      render: (row: any) => row.name
    },
    {
      name: 'Scheduled Value',
      render: (row: any) => row.scheduledValue
    },
    {
      name: 'Previously Billing',
      render: (row: any) => row.previousBilling
    },
    {
      name: 'Current Period Work',
      render: (row: any) => row.currentPeriodWork
    },
    {
      name: 'Total Completed',
      render: (row: any) => row.totalCompleted
    },
    {
      name: 'Remaining Balance',
      render: (row: any) => row.remainingBalance
    }
  ];

  // inner table column name and render config
  const innerTableConfig = [
    {
      name: 'Name',
      render: (row: any) => row.name
    },
    {
      name: 'Rate',
      render: (row: any) => row.rate
    },
    {
      name: 'Work Hours',
      render: (row: any) => row.workHours
    },
    {
      name: 'Amount',
      render: (row: any) => row.gross
    }
  ];
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItem: 'center', gap: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <h3>{`Invoice: #${id}`}</h3>
          <Box sx={{ display: 'flex', alignItem: 'center', gap: 1 }}>
            <CalendarTodayIcon />
            <div>5/29/2023 - 6/5/2023</div>
          </Box>
        </Box>
        <Box sx={{ color: 'error.main', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>Delete</Box>
      </Box>
      <Box>
        <CollapsibleTable rows={rows} outerTableConfig={outerTableConfig} innerTableConfig={innerTableConfig} innerTitle="Employees" />
      </Box>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Button variant="contained">Export to Clickup</Button>
      </Box>
    </Box>
  );
};
