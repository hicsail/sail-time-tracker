import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { Paths } from '@constants/paths';
import { FormDialog } from '@components/form/FormDialog';
import { EmployeeForm } from '@pages/Employee/components/form/EmployeeForm';
import { StyledPaper } from '@components/StyledPaper';
import { DropDownMenu } from '@components/form/DropDownMenu';
import AddIcon from '@mui/icons-material/Add';
import { BasicTable } from '@components/table/BasicTable';
import { SearchBar } from '@components/SearchBar';

interface EmployeeTableProps {
  data: any[];
}

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

export const EmployeeTable: FC<EmployeeTableProps> = ({ data }) => {
  const [open, setOpen] = useState({
    add: false,
    edit: false
  });
  const [searchText, setSearchText] = useState<string>('');
  const [filter, setFilter] = useState<string>('Active');
  const navigate = useNavigate();

  const handleClickOpen = (type: string) => {
    setOpen((prevState) => ({ ...prevState, [type]: true }));
  };

  const handleOnClose = (type: string) => {
    setOpen((prevState) => ({ ...prevState, [type]: false }));
    navigate(Paths.EMPLOYEE_lIST);
  };

  const filteredRows = data.filter((row) => {
    if (filter !== 'All') {
      return row.status.toLowerCase() === filter.toLowerCase() && row.name.toLowerCase().includes(searchText.toLowerCase());
    }
    return row && row.name.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleDropdownOnChange = (e: SelectChangeEvent<string>) => setFilter(e.target.value);

  const columns: any[] = [
    {
      field: 'name',
      headerName: 'Employee NAME',
      width: 150
    },
    { field: 'email', headerName: 'EMAIL', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (row: any) => (
        <Chip
          label={row.status}
          sx={{
            backgroundColor: row.status === 'Active' ? 'success.light' : 'error.light',
            color: row.status === 'Active' ? 'success.main' : 'error.main',
            padding: '0 10px',
            borderRadius: '8px',
            fontWeight: 'medium'
          }}
        />
      ),
      width: 150
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (row: any) => (
        <Button
          variant="outlined"
          onClick={() => {
            navigate(`${Paths.EMPLOYEE_lIST}/${row.id}`);
            handleClickOpen('edit');
          }}
          color="secondary"
        >
          Edit
        </Button>
      )
    }
  ];

  const ToolBar = (
    <>
      <Stack direction="row" width="100%" justifyContent="space-between" marginBottom={5}>
        <Typography variant="h6">All Employees</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: '8px', backgroundColor: 'grey.800', '&:hover': { backgroundColor: 'grey.700' } }}
          onClick={() => handleClickOpen('add')}
        >
          New Employee
        </Button>
        <FormDialog open={open.add} onClose={() => handleOnClose('add')}>
          <EmployeeForm handleClose={() => handleOnClose('add')} />
        </FormDialog>
      </Stack>
      <Stack direction="row" gap={2} mb={3}>
        <DropDownMenu data={dropdownData} onChange={handleDropdownOnChange} label="Status" name="employee-status-dropdown" id="employee-status-dropdown" value={filter} />
        <SearchBar id="search projects" value={searchText} setValue={setSearchText} />
      </Stack>
    </>
  );

  const keyFun = (row: any) => row.id;

  return (
    <Box sx={{ width: '100%', marginTop: 8 }}>
      <StyledPaper elevation={0}>
        <BasicTable
          rows={filteredRows}
          columns={columns}
          keyFun={keyFun}
          toolbar={ToolBar}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 }
            }
          }}
        />
        <FormDialog open={open.edit} onClose={() => handleOnClose('edit')}>
          <EmployeeForm handleClose={() => handleOnClose('edit')} />
        </FormDialog>
        {data.length === 0 && (
          <Box>
            <Button sx={{ width: '100%', height: '200px', fontSize: '1.2rem' }} onClick={() => handleClickOpen('new')}>
              Add Your First Employee
            </Button>
            <FormDialog open={open.add} onClose={() => handleOnClose('add')}>
              <EmployeeForm handleClose={() => handleOnClose('add')} />
            </FormDialog>
          </Box>
        )}
      </StyledPaper>
    </Box>
  );
};
