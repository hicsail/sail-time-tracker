import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
  Button,
  Chip,
  TablePagination,
  Typography,
  Stack,
  InputAdornment,
  SelectChangeEvent
} from '@mui/material';
import { EnhancedTableHead } from '@pages/Project/components/table/EnhencedTableHead';
import { Paths } from '@constants/paths';
import { FormDialog } from '@components/form/FormDialog';
import { ProjectForm } from '@pages/Project/components/form/ProjectForm';
import { StyledPaper } from '@components/StyledPaper';
import AddIcon from '@mui/icons-material/Add';
import { EmployeeForm } from '@pages/Employee/components/form/EmployeeForm';
import { DropDownMenu } from '@components/form/DropDownMenu';
import { TextInput } from '@components/TextInput';
import SearchIcon from '@mui/icons-material/Search';
import { TableHeadCover } from '@pages/Employee/components/table/TableHeadCover';
import { GetProjectListDocument, useDeleteProjectsMutation } from '@graphql/project/project';

interface ProjectTableProps {
  data: any[];
}

export const ProjectTable: FC<ProjectTableProps> = ({ data }) => {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = useState({
    add: false,
    edit: false
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState<string>('');
  const [rows, setRows] = useState(data ? data : []);
  const [filter, setFilter] = useState<string>('Active');
  const [deleteProjects] = useDeleteProjectsMutation();

  const handleClickOpen = (type: string) => {
    setOpen((prevState) => ({ ...prevState, [type]: true }));
  };

  const handleOnClose = (type: string) => {
    setOpen((prevState) => ({ ...prevState, [type]: false }));
    navigate(Paths.PROJECT_lIST);
  };

  /**
   * this method is used to handle select all employees' event.
   * @param event
   */
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  /**
   * this method is used to handle select single employee event.
   * @param event
   * @param id
   */
  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const isSelected = (id: string) => {
    return selected.indexOf(id) !== -1;
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    let filteredRows = data;

    if (searchText && searchText !== '') {
      const searchFilter = (row: any) => row.name.toLowerCase().includes(searchText.toLowerCase());

      filteredRows = filteredRows.filter(searchFilter);
    }

    if (filter && filter !== 'All') {
      const statusFilter = (row: any) => row.status === filter;

      filteredRows = filteredRows.filter(statusFilter);
    }

    setRows(filteredRows);
  }, [searchText, filter, data]);

  useEffect(() => {
    let filteredRows = data;

    if (filter === 'Active') {
      filteredRows = data.filter((row) => row.status === 'Active');
    } else if (filter === 'Inactive') {
      filteredRows = data.filter((row) => row.status === 'Inactive');
    }

    setRows(filteredRows);
  }, [filter, data]);

  const dropdownData = [
    {
      id: 'All',
      name: 'All'
    },
    {
      id: 'Active',
      name: 'Active'
    },
    {
      id: 'Inactive',
      name: 'Inactive'
    }
  ];

  const handleDropdownOnChange = (e: SelectChangeEvent<string>) => {
    setFilter(e.target.value);
  };

  const handleClickDelete = async () => {
    await deleteProjects({
      variables: {
        ids: selected as string[]
      },
      refetchQueries: [{ query: GetProjectListDocument }]
    });
    setSelected([]);
  };

  return (
    <Box sx={{ width: '100%', marginTop: 8 }}>
      <StyledPaper elevation={0}>
        <Stack direction="row" width="100%" justifyContent="space-between" marginBottom={5}>
          <Typography variant="h6">All Projects</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: '8px', backgroundColor: 'grey.800', '&:hover': { backgroundColor: 'grey.700' } }}
            onClick={() => handleClickOpen('add')}
          >
            New Project
          </Button>
          <FormDialog open={open.add} onClose={() => handleOnClose('add')}>
            <ProjectForm handleClose={() => handleOnClose('add')} />
          </FormDialog>
        </Stack>
        <Stack direction="row" gap={2} mb={3}>
          <DropDownMenu data={dropdownData} onChange={handleDropdownOnChange} label="Status" name="employee-status-dropdown" id="employee-status-dropdown" value={filter} />
          <TextInput
            value={searchText}
            setValue={setSearchText}
            id="search-employee"
            variant="outlined"
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ mr: 1, color: 'grey.500' }} />
                </InputAdornment>
              )
            }}
          />
        </Stack>
        <TableContainer>
          <Table sx={{ minWidth: 750, position: 'relative' }}>
            <TableHeadCover
              rowCount={rows.length}
              selected={selected}
              setSelected={setSelected}
              handleSelectAllClick={handleSelectAllClick}
              handleClickDelete={handleClickDelete}
            />
            <EnhancedTableHead numSelected={selected.length} onSelectAllClick={handleSelectAllClick} rowCount={rows.length} />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    sx={{ '& .MuiTableCell-root': { fontWeight: 'medium' } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onClick={(event) => handleClick(event, row.id)}
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      sx={{
                        width: '100px',
                        paddingRight: '3rem',
                        paddingLeft: '0'
                      }}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '100px', paddingRight: '3rem', paddingLeft: '0' }}>
                      {row.description}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '100px', paddingRight: '3rem', paddingLeft: '0' }}>
                      {row.rate}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '100px', paddingRight: '3rem' }}>
                      <Chip
                        label={row.status}
                        sx={{
                          backgroundColor: row.status === 'Active' ? 'success.light' : 'error.light',
                          color: row.status === 'Active' ? 'success.main' : 'error.main',
                          padding: '0 10px'
                        }}
                      />
                    </TableCell>
                    <TableCell align="left" sx={{ width: '100px', paddingRight: '3rem' }}>
                      <Chip
                        label={row.isBillable.toString()}
                        sx={{
                          backgroundColor: row.isBillable ? 'success.light' : 'error.light',
                          color: row.isBillable ? 'success.main' : 'error.main',
                          padding: '0 10px'
                        }}
                      />
                    </TableCell>
                    <TableCell align="left" sx={{ border: 'none', width: '100px', underline: 'none' }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          navigate(`${Paths.PROJECT_lIST}/${row.id}`);
                          handleClickOpen('edit');
                        }}
                        color="secondary"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              <FormDialog open={open.edit} onClose={() => handleOnClose('edit')}>
                <ProjectForm handleClose={() => handleOnClose('edit')} />
              </FormDialog>
            </TableBody>
          </Table>
        </TableContainer>
        {data.length === 0 && (
          <Box>
            <Button sx={{ width: '100%', height: '200px', fontSize: '1.2rem' }} onClick={() => handleClickOpen('add')}>
              Add Your First Project
            </Button>
            <FormDialog open={open.add} onClose={() => handleOnClose('add')}>
              <ProjectForm handleClose={() => handleOnClose('add')} />
            </FormDialog>
          </Box>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledPaper>
    </Box>
  );
};
