import { CustomTableContainer } from '@components/CustomTableContainer';
import { StyledTableDataRow, StyledTableHeadRow } from '@components/StyledComponent';
import { Collapse, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useState } from 'react';
import { ExpandButton } from '@components/ExpandButton';

export const BurndownTable: React.FC = () => {
  return (
    <CustomTableContainer>
      <Table>
        <TableHead>
          <StyledTableHeadRow>
            <TableCell></TableCell>
            <TableCell>Project Name</TableCell>
            <TableCell>Is Billable</TableCell>
            <TableCell>Work Hours</TableCell>
            <TableCell>Billable Hours</TableCell>
          </StyledTableHeadRow>
        </TableHead>

        <TableBody>
          <BurndownTableRow project='ASL-LEX' isBillable={true} workHours={30} billableHours={30} />
        </TableBody>
      </Table>
    </CustomTableContainer>
  );
};

interface BurndownTableRowProps {
  project: string;
  isBillable: boolean;
  workHours: number;
  billableHours: number;
}

const BurndownTableRow: React.FC<BurndownTableRowProps> = (props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <StyledTableDataRow>
        {/* Open Button*/}
        <TableCell>
          <ExpandButton open={open} setOpen={setOpen} />
        </TableCell>
        <TableCell>{props.project}</TableCell>
        <TableCell>{props.isBillable.toString()}</TableCell>
        <TableCell>{props.workHours}</TableCell>
        <TableCell>{props.billableHours}</TableCell>
      </StyledTableDataRow>
      {open &&  (
        <TableRow>
          <TableCell>
            <Collapse in={open}>Hello</Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
