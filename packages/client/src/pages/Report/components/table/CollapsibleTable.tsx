import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, Box } from '@mui/material';
import { FC, Fragment, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { formatDateToDashFormat } from '../../../../utils/helperFun';

interface CollapsibleTableProps {
  rows: any[];
  tableConfig: any;
  innerTitle: string;
  startDate: Date;
  endDate: Date;
}

export const CollapsibleTable: FC<CollapsibleTableProps> = ({ rows, tableConfig, innerTitle, startDate, endDate }) => {
  const formattedStartDate = formatDateToDashFormat(startDate);
  const formattedEndDate = formatDateToDashFormat(endDate);
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ borderRadius: '8px', boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px' }}
    >
      <Table size="small" aria-label="outer-table">
        <TableHead sx={{ padding: '50px 0' }}>
          <TableRow sx={{ '& .MuiTableCell-root': { border: 'none', backgroundColor: 'grey.200', paddingTop: '1rem', paddingBottom: '1rem' } }}>
            <TableCell />
            {tableConfig.outer.map((config: any) => (
              <TableCell key={config.id} align="left">
                {config.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((project: any) => {
            const key = `${project.id}#${formattedStartDate}#${formattedEndDate}`;
            return <RenderRow key={key} project={project} innerTitle={innerTitle} tableConfig={tableConfig} id={key} />;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface RenderRowProps {
  project: any;
  tableConfig: any;
  innerTitle: string;
  id: string;
}

export const RenderRow: FC<RenderRowProps> = ({ project, tableConfig, innerTitle, id }) => {
  const hasInnerTable = project.inner && project.inner.length > 0;
  const [open, setOpen] = useState(false);

  return (
    <Fragment key={project.id}>
      <TableRow
        sx={{
          '& .MuiTableCell-root': { borderBottom: open ? 'none' : '1px dashed', borderColor: 'grey.200' },
          backgroundColor: open ? 'grey.200' : 'inherit',
          boxShadow: open ? 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px' : 'inhert'
        }}
      >
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)} disabled={project.inner.length === 0}>
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>
        {tableConfig.outer.map((config: any) => (
          <TableCell key={config.id} align="left">
            {config.render(project)}
          </TableCell>
        ))}
      </TableRow>
      {hasInnerTable && (
        <TableRow sx={{ '& .MuiTableCell-root': { border: 'none' }, backgroundColor: open ? 'grey.200' : 'inherit' }}>
          <TableCell colSpan={tableConfig.outer.length + 1}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography>{innerTitle}</Typography>
                <RenderInnerTable innerData={project.inner} tableConfig={tableConfig} id={id} />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
};

interface RenderInnerTableProps {
  innerData: any[];
  tableConfig: any;
  id: string;
}

export const RenderInnerTable: FC<RenderInnerTableProps> = ({ innerData, tableConfig, id }) => {
  return (
    <Table
      size="small"
      aria-label="inner-table"
      sx={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        mt: 3,
        boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px'
      }}
    >
      <TableHead sx={{ backgroundColor: 'grey.200' }}>
        <TableRow>
          {tableConfig.inner.map((cell: any) => (
            <TableCell key={cell.id} align="left" sx={{ border: 'none' }}>
              {cell.name}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {innerData.map((row: any) => {
          const key = row.employeeId ? `${id}#${row.employeeId}` : `${id}#${row.projectId}`;
          return (
            <TableRow key={key}>
              {tableConfig.inner.map((cell: any) => {
                const cellKey = `${key}#${cell.id}`;
                return (
                  <TableCell align="left" key={cellKey} sx={{ border: 'none' }}>
                    {cell.render(row)}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
