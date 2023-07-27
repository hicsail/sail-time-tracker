import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Chip, Typography, Stack, SelectChangeEvent } from '@mui/material';
import { Paths } from '@constants/paths';
import { FormDialog } from '@components/form/FormDialog';
import { ProjectForm } from '@pages/Project/components/form/ProjectForm';
import { StyledPaper } from '@components/StyledPaper';
import AddIcon from '@mui/icons-material/Add';
import { DropDownMenu } from '@components/form/DropDownMenu';
import { BasicTable } from '@components/table/BasicTable';
import { SearchBar } from '@components/SearchBar';

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

interface ProjectTableProps {
  data: any[];
}

export const ProjectTable: FC<ProjectTableProps> = ({ data }) => {
  const [open, setOpen] = useState({
    add: false,
    edit: false
  });
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState<string>('');
  const [filter, setFilter] = useState<string>('Active');

  const handleClickOpen = (type: string) => {
    setOpen((prevState) => ({ ...prevState, [type]: true }));
  };

  const handleOnClose = (type: string) => {
    setOpen((prevState) => ({ ...prevState, [type]: false }));
    navigate(Paths.PROJECT_lIST);
  };

  const filteredRows = data.filter((row) => {
    if (filter !== 'All') {
      return row.status.toLowerCase() === filter.toLowerCase() && row.name.toLowerCase().includes(searchText.toLowerCase());
    }
    return row && row.name.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleDropdownOnChange = (e: SelectChangeEvent<string>) => setFilter(e.target.value);

  const contractTypeColor = (id: number, type?: string) => {
    switch (id) {
      case 0:
        return type === 'bg' ? 'grey.300' : 'grey.700';
      case 1:
        return type === 'bg' ? 'warning.light' : 'warning.dark';
      case 2:
        return type === 'bg' ? 'info.light' : 'info.dark';
    }
  };

  const columns: any[] = [
    {
      field: 'name',
      headerName: 'PROJECT NAME',
      width: 150
    },
    { field: 'description', headerName: 'Description', width: 130 },
    { field: 'rate', headerName: 'Rate', width: 130 },
    { field: 'fte', headerName: 'FTE', width: 130 },
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
      field: 'isBillable',
      headerName: 'isBillable',
      renderCell: (row: any) => (
        <Chip
          label={row.isBillable.toString()}
          sx={{
            backgroundColor: row.isBillable ? 'success.light' : 'error.light',
            color: row.isBillable ? 'success.main' : 'error.main',
            padding: '0 10px',
            borderRadius: '8px',
            fontWeight: 'medium'
          }}
        />
      ),
      width: 160
    },
    {
      field: 'contractType',
      headerName: 'Contract Type',
      renderCell: (row: any) => (
        <Chip
          label={row.contractType.name}
          sx={{
            backgroundColor: contractTypeColor(row.contractType.id, 'bg'),
            color: contractTypeColor(row.contractType.id),
            padding: '0 10px',
            borderRadius: '8px',
            fontWeight: 'medium'
          }}
        />
      ),
      width: 160
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (row: any) => (
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
      )
    }
  ];

  const ToolBar = (
    <>
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
          <ProjectForm handleClose={() => handleOnClose('edit')} />
        </FormDialog>
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
      </StyledPaper>
    </Box>
  );
};
