import { Table, TableBody, TableHead, TablePagination } from '@mui/material';
import { FC, Fragment, ReactNode, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import { StyledTableDataRow, StyledTableHeadRow } from '@components/StyledComponent';
import { CustomTableContainer } from '@components/CustomTableContainer';

export interface BasicTableProps {
  rows: any[];
  columns: any[];
  toolbar?: ReactNode;
  keyFun: (row: any) => string;
  initialState?: any;
  sx?: any;
  hidePagination?: boolean;
}

export const BasicTable: FC<BasicTableProps> = ({ rows, columns, toolbar, keyFun, initialState, hidePagination }) => {
  const {
    pagination: { paginationModel }
  } = initialState || { pagination: { paginationModel: { page: 0, pageSize: 10 } } };

  const [page, setPage] = useState(paginationModel.page);
  const [rowsPerPage, setRowsPerPage] = useState(paginationModel.pageSize);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const renderedHeaders: ReactNode = columns.map((column) => {
    if (column.header) return <Fragment key={column.field}>{column.header()}</Fragment>;

    return (
      <TableCell key={column.field} align={column.headerAlign ? column.headerAlign : 'left'} sx={{ width: column.width ? column.width : '150px', textTransform: 'capitalize' }}>
        {column.header ? column.header() : column.headerName}
      </TableCell>
    );
  });

  const renderRows: ReactNode = visibleRows.map((row) => {
    const renderCells: ReactNode = columns.map((column) => (
      <TableCell align={column.align ? column.align : 'left'} key={column.field}>
        {column.renderCell ? column.renderCell(row) : row[column.field]}
      </TableCell>
    ));

    return <StyledTableDataRow key={keyFun(row)}>{renderCells}</StyledTableDataRow>;
  });

  return (
    <CustomTableContainer>
      {toolbar}
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <StyledTableHeadRow>{renderedHeaders}</StyledTableHeadRow>
        </TableHead>
        <TableBody>{renderRows}</TableBody>
      </Table>
      {!hidePagination && rows.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </CustomTableContainer>
  );
};
