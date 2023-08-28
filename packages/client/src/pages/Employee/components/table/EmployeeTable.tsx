import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, IconButton, List, ListItem, SelectChangeEvent, Stack, Tooltip, Typography } from '@mui/material';
import { Paths } from '@constants/paths';
import { FormDialog } from '@components/form/FormDialog';
import { EmployeeForm } from '@pages/Employee/components/form/EmployeeForm';
import { DropDownMenu } from '@components/form/DropDownMenu';
import AddIcon from '@mui/icons-material/Add';
import { BasicTable } from '@components/table/BasicTable';
import { SearchBar } from '@components/SearchBar';
import { DefaultContainedButton } from '@components/StyledComponent';
import { ThreeDotIcon } from '@components/icons/ThreeDot';
import { EditIcon } from '@components/icons/EditIcon';
import { ArchiveIcon } from '@components/icons/ArchiveIcon';
import { CustomPopover } from '@components/CuctomPopover';
import { useEmployeeUpdateInputMutation } from '@graphql/employee/employee';
import { useSnackBar } from '@context/snackbar.context';

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
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const openPopover = Boolean(anchorEl);
  const [searchText, setSearchText] = useState<string>('');
  const [filter, setFilter] = useState<string>('Active');
  const navigate = useNavigate();
  const [updateEmployee] = useEmployeeUpdateInputMutation();
  const [targetRow, setTargetRow] = useState<any>();
  const { toggleSnackBar } = useSnackBar();

  const handleClickOpen = () => setOpen(true);

  const handleOnClose = () => {
    setOpen(false);
    navigate(Paths.EMPLOYEE_lIST);
  };

  const filteredRows = data.filter((row) => {
    if (filter !== 'All') {
      return row.status.toLowerCase() === filter.toLowerCase() && row.name.toLowerCase().includes(searchText.toLowerCase());
    }
    return row && row.name.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleDropdownOnChange = (e: SelectChangeEvent<string>) => setFilter(e.target.value);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, row: any) => {
    setAnchorEl(event.currentTarget);
    setTargetRow(row);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleArchive = async () => {
    const { __typename, ...employee } = targetRow;
    const message = employee.status === 'Active' ? 'Successfully archived the employee!' : 'Successfully unarchived the employee!';
    const status = employee.status === 'Active' ? 'Inactive' : 'Active';
    const res = await updateEmployee({
      variables: {
        updateEmployee: { ...employee, status: status }
      }
    });

    res.data?.updateEmployee && toggleSnackBar(message, { variant: 'success' });
  };

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
      headerName: '',
      headerAlign: 'right',
      align: 'right',
      renderCell: (row: any) => (
        <Stack direction="row" gap={2} justifyContent="end">
          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                navigate(`${Paths.EMPLOYEE_lIST}/${row.id}`);
                handleClickOpen();
              }}
            >
              <EditIcon
                fontSize="medium"
                sx={{
                  color: 'grey.600'
                }}
              />
            </IconButton>
          </Tooltip>
          <IconButton onClick={(e) => handleClick(e, row)}>
            <ThreeDotIcon
              fontSize="medium"
              sx={{
                color: openPopover ? '#1C274C' : 'grey.600',
                transform: 'rotate(90deg)'
              }}
            />
          </IconButton>
        </Stack>
      )
    }
  ];

  const ToolBar = (
    <>
      <Stack direction="row" justifyContent="space-between" mb={5}>
        <Typography variant="h6">All Employees</Typography>
        <DefaultContainedButton variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
          New Employee
        </DefaultContainedButton>
      </Stack>
      <Stack direction="row" gap={2} mb={3}>
        <DropDownMenu data={dropdownData} onChange={handleDropdownOnChange} label="Status" name="employee-status-dropdown" id="employee-status-dropdown" value={filter} />
        <SearchBar id="search projects" value={searchText} setValue={setSearchText} />
      </Stack>
    </>
  );

  const keyFun = (row: any) => row.id;

  return (
    <Box>
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
      {data.length === 0 && (
        <Box>
          <Button sx={{ width: '100%', height: '200px', fontSize: '1.2rem' }} onClick={handleClickOpen}>
            Add Your First Employee
          </Button>
        </Box>
      )}
      <FormDialog open={open} onClose={handleOnClose}>
        <EmployeeForm handleClose={handleOnClose} />
      </FormDialog>
      <CustomPopover open={openPopover} anchorEl={anchorEl} onClose={handlePopoverClose}>
        <List sx={{ '& .MuiListItem-root': { cursor: 'pointer' } }}>
          <ListItem sx={{ gap: 2 }} onClick={handleArchive}>
            <ArchiveIcon fontSize="small" />
            <Typography variant="body1">{targetRow?.status === 'Active' ? 'Archive' : 'Unarchive'}</Typography>
          </ListItem>
        </List>
      </CustomPopover>
    </Box>
  );
};
