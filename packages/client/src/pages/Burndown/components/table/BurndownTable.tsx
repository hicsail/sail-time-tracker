import { CustomTableContainer } from '@components/CustomTableContainer';
import { StyledTableDataRow, StyledTableHeadRow } from '@components/StyledComponent';
import { KeyboardArrowRight } from '@mui/icons-material';
import { IconButton, Table, TableBody, TableCell, TableHead } from '@mui/material';

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
  return (
    <StyledTableDataRow>
      {/* Open Button*/}
      <TableCell>
        <ExpandButton />
      </TableCell>
      <TableCell>{props.project}</TableCell>
      <TableCell>{props.isBillable.toString()}</TableCell>
      <TableCell>{props.workHours}</TableCell>
      <TableCell>{props.billableHours}</TableCell>
    </StyledTableDataRow>
  );
};

const ExpandButton: React.FC = () => {
  return (
    <IconButton size="small">
      <KeyboardArrowRight />
    </IconButton>
  );
};
