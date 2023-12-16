import { Table, TableBody, TableCell, TableHead } from '@mui/material';
import { FC, Fragment, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { formatDateToDashFormat } from '../../../../utils/helperFun';
import { CustomTableContainer } from '@components/CustomTableContainer';
import { StyledTableDataRow, StyledTableHeadRow } from '@components/StyledComponent';

export interface CollapsibleTableProps {
  rows: any[];
  tableConfig: any;
  startDate: Date;
  endDate: Date;
}

export const CollapsibleTable: FC<CollapsibleTableProps> = ({ rows, tableConfig, startDate, endDate }) => {
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

              return (
                <TableCell key={config.field} sx={{ width: '200px' }}>
                  {config.name}
                </TableCell>
              );
            })}
          </StyledTableHeadRow>
        </TableHead>
        <TableBody>
          {rows.map((project: any) => {
            const key = `${project.id}#${formattedStartDate}#${formattedEndDate}`;
            return <RenderRow key={key} project={project} tableConfig={tableConfig} id={key} />;
          })}
        </TableBody>
      </Table>
    </CustomTableContainer>
  );
};

interface RenderRowProps {
  project: any;
  tableConfig: any;
  id: string;
}

export const RenderRow: FC<RenderRowProps> = ({ project, tableConfig, id }) => {
  const hasInnerTable = project.inner && project.inner.length > 0;
  const [open, setOpen] = useState(true);

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
      {hasInnerTable && <RenderInnerTable innerData={project.inner} tableConfig={tableConfig} id={id} open={open} employeeId={project.id} />}
    </>
  );
};

interface RenderInnerTableProps {
  innerData: any[];
  tableConfig: any;
  id: string;
  open: boolean;
  employeeId: string;
}

export const RenderInnerTable: FC<RenderInnerTableProps> = ({ innerData, tableConfig, id, open, employeeId }) => {
  return (
    <>
      {open &&
        innerData.map((row: any) => {
          const key = row.employeeId ? `${id}#${row.employeeId}` : `${id}#${row.projectId}`;
          return (
            <StyledTableDataRow key={key}>
              <TableCell />
              {tableConfig.inner.map((cell: any) => {
                const cellKey = `${key}#${cell.field}`;
                return <TableCell key={cellKey}>{cell.render({ ...row, employeeId: employeeId })}</TableCell>;
              })}
            </StyledTableDataRow>
          );
        })}
    </>
  );
};
