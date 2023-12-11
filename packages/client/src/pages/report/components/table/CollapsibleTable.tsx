import { Table, TableBody, TableCell, TableHead, Stack } from '@mui/material';
import { FC, Fragment, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { formatDateToDashFormat } from '../../../../utils/helperFun';
import { CustomTableContainer } from '@components/CustomTableContainer';
import { StyledNestedTableDataRow, StyledTableDataRow, StyledTableHeadRow } from '@components/StyledComponent';

export interface CollapsibleTableProps {
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
    <CustomTableContainer sx={{ padding: 0 }}>
      <Table aria-label="outer-table">
        <TableHead>
          <StyledTableHeadRow>
            <TableCell />
            {tableConfig.outer.map((config: any) => {
              if (config.header) {
                return <Fragment key={config.field}>{config.header()}</Fragment>;
              }

              return <TableCell key={config.field}>{config.name}</TableCell>;
            })}
          </StyledTableHeadRow>
        </TableHead>
        <TableBody>
          {rows.map((project: any) => {
            const key = `${project.id}#${formattedStartDate}#${formattedEndDate}`;
            return <RenderRow key={key} project={project} innerTitle={innerTitle} tableConfig={tableConfig} id={key} />;
          })}
        </TableBody>
      </Table>
    </CustomTableContainer>
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
    <>
      <StyledTableDataRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)} disabled={project.inner.length === 0}>
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>
        {tableConfig.outer.map((config: any) => (
          <TableCell key={config.field}>{config.render(project)}</TableCell>
        ))}
      </StyledTableDataRow>
      {open && hasInnerTable && (
        <StyledNestedTableDataRow open={open}>
          <TableCell colSpan={tableConfig.outer.length + 1}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Stack gap={2} padding={1}>
                <Typography>{innerTitle}</Typography>
                <RenderInnerTable innerData={project.inner} tableConfig={tableConfig} id={id} />
              </Stack>
            </Collapse>
          </TableCell>
        </StyledNestedTableDataRow>
      )}
    </>
  );
};

interface RenderInnerTableProps {
  innerData: any[];
  tableConfig: any;
  id: string;
}

export const RenderInnerTable: FC<RenderInnerTableProps> = ({ innerData, tableConfig, id }) => {
  return (
    <CustomTableContainer sx={{ padding: 0 }}>
      <Table size="small" aria-label="inner-table">
        <TableHead>
          <StyledTableHeadRow>
            {tableConfig.inner.map((cell: any) => (
              <TableCell key={cell.field}>{cell.name}</TableCell>
            ))}
          </StyledTableHeadRow>
        </TableHead>
        <TableBody>
          {innerData.map((row: any) => {
            const key = row.employeeId ? `${id}#${row.employeeId}` : `${id}#${row.projectId}`;
            return (
              <StyledTableDataRow key={key}>
                {tableConfig.inner.map((cell: any) => {
                  const cellKey = `${key}#${cell.field}`;
                  return <TableCell key={cellKey}>{cell.render(row)}</TableCell>;
                })}
              </StyledTableDataRow>
            );
          })}
        </TableBody>
      </Table>
    </CustomTableContainer>
  );
};
