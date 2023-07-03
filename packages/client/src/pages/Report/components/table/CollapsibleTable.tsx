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
    <TableContainer component={Paper} elevation={0}>
      <Table size="small" aria-label="outer-table">
        <TableHead>
          <TableRow>
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
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
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
        <TableRow>
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
    <Table size="small" aria-label="inner-table">
      <TableHead>
        <TableRow>
          {tableConfig.inner.map((cell: any) => (
            <TableCell key={cell.id} align="left">
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
                  <TableCell align="left" key={cellKey}>
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
