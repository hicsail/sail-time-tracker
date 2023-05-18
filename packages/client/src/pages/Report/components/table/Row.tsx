import * as React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';

export const Row = (props: { row: any; innerTableConfig: any; innerTitle: string; outerTableConfig: any }) => {
  const { row, innerTableConfig, innerTitle, outerTableConfig } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>
        {outerTableConfig.map((config: any) => {
          return <TableCell>{config.render(row)}</TableCell>;
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div" sx={{ fontSize: "1rem", fontWeight: 'medium'}}>
                {innerTitle}
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    {innerTableConfig.map((cell: any) => (
                      <TableCell align={cell.align}>{cell.name}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.inner.map((innerRow: any) => {
                    return (
                      <TableRow>
                        {innerTableConfig.map((row: any) => {
                          return <TableCell align={row.align ? row.align : 'left'}>{row.render(innerRow)}</TableCell>;
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
