import { StyledPaper } from '@components/StyledPaper';
import { Table, TableBody, TableHead, TableRow, TableContainer, TablePagination, alpha } from '@mui/material';
import { FC, Fragment, ReactNode, useState } from 'react';
import TableCell from '@mui/material/TableCell';

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
      <TableCell key={column.field} align={column.headerAlign ? column.headerAlign : 'left'} sx={{ width: column.width ? column.width : '150px' }}>
        {column.header ? column.header() : column.headerName.toUpperCase()}
      </TableCell>
    );
  });

  const renderRows: ReactNode = visibleRows.map((row) => {
    const renderCells: ReactNode = columns.map((column) => (
      <TableCell align={column.align ? column.align : 'left'} key={column.field}>
        {column.renderCell ? column.renderCell(row) : row[column.field]}
      </TableCell>
    ));

    return (
      <TableRow
        key={keyFun(row)}
        sx={{
          '& .MuiTableCell-root': {
            fontWeight: 'regular',
            fontSize: '1rem',
            borderBottom: '1px dashed',
            borderColor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'rgb(46, 50, 54)')
          },
          '&:hover': { backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'grey.100' : alpha(theme.palette.grey[500], 0.08)) }
        }}
      >
        {renderCells}
      </TableRow>
    );
  });

  return (
    <TableContainer component={StyledPaper} elevation={0}>
      {toolbar}
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow
            sx={{
              '& .MuiTableCell-root': {
                color: (theme) => (theme.palette.mode === 'light' ? 'grey.600' : 'grey.500'),
                bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : alpha(theme.palette.grey[500], 0.12)),
                fontWeight: 'medium',
                border: 'none'
              }
            }}
          >
            {renderedHeaders}
          </TableRow>
        </TableHead>
        <TableBody>{renderRows}</TableBody>
      </Table>
      {!hidePagination && (
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
    </TableContainer>
  );
};
