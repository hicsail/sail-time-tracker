import { StyledPaper } from '@components/StyledPaper';
import { Table, TableBody, TableHead, TableRow, TableContainer, TablePagination } from '@mui/material';
import { FC, useState } from 'react';
import TableCell from '@mui/material/TableCell';

interface BasicTableProps {
  rows: any[];
  columns: any[];
  toolbar?: JSX.Element;
  keyFun: (row: any) => string;
  initialState?: any;
  sx?: any;
}

export const BasicTable: FC<BasicTableProps> = ({ rows, columns, toolbar, keyFun, initialState, ...otherProps }) => {
  const {
    pagination: { paginationModel }
  } = initialState;

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

  const renderedHeaders = columns.map((column) => (
    <TableCell
      key={column.field}
      align={column.headerAlign ? column.headerAlign : 'left'}
      sx={{ width: column.width ? column.width : '150px', color: 'grey.600', fontWeight: 'medium', bgcolor: 'grey.200', border: 'none' }}
    >
      {column.headerName}
    </TableCell>
  ));

  const renderRows = visibleRows.map((row) => {
    const renderCells = columns.map((column) => (
      <TableCell align={column.align ? column.align : 'left'} key={column.field}>
        {column.renderCell ? column.renderCell(row) : row[column.field]}
      </TableCell>
    ));

    return (
      <TableRow
        key={keyFun(row)}
        sx={{
          '& .MuiTableCell-root': { fontWeight: 'regular', fontSize: '1rem', borderBottom: '1px dashed', borderColor: 'grey.200' },
          '&:hover': { backgroundColor: 'grey.100' }
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
          <TableRow>{renderedHeaders}</TableRow>
        </TableHead>
        <TableBody>{renderRows}</TableBody>
      </Table>
      {paginationModel && (
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
