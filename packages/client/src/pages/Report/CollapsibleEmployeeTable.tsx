import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

function createData(name: string, workHours: number, indirectHours: number, absenceHours: number, totalHours: number, rate: number) {
  return {
    name,
    workHours,
    indirectHours,
    absenceHours,
    totalHours,
    rate,
    history: [
      {
        id: '1',
        name: 'Project 1',
        isBillable: true,
        hours: 3
      },
      {
        id: '1',
        name: 'Project 2',
        isBillable: false,
        hours: 10
      }
    ]
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.workHours}</TableCell>
        <TableCell align="right">{row.indirectHours}</TableCell>
        <TableCell align="right">{row.absenceHours}</TableCell>
        <TableCell align="right">{row.totalHours}</TableCell>
        <TableCell align="right">{row.rate}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Project
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>isBillable</TableCell>
                    <TableCell align="right">Hours</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.id}>
                      <TableCell component="th" scope="row">
                        {historyRow.name}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={historyRow.isBillable ? { backgroundColor: 'rgb(250, 236,204)' } : { backgroundColor: 'rgb(250, 227,222)' }}
                          width={40}
                          height={20}
                          textAlign="center"
                          borderRadius="3px"
                        >
                          {historyRow.isBillable.toString()}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{historyRow.hours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData('Employee 1', 60, 6, 4, 64, 0.99),
  createData('Employee 2', 237, 9.0, 37, 4.3, 0.99),
  createData('Employee 3', 262, 16.0, 24, 6.0, 0.79),
  createData('Employee 4', 305, 3.7, 67, 4.3, 0.5),
  createData('Employee 5', 356, 16.0, 49, 3.9, 0.5)
];

export default function CollapsibleEmployeeTable() {
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Employees</TableCell>
              <TableCell align="right">Work Hours</TableCell>
              <TableCell align="right">Indirect Hours</TableCell>
              <TableCell align="right">Absence Hours</TableCell>
              <TableCell align="right">Total Hours</TableCell>
              <TableCell align="right">Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
