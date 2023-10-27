import React, { FC, useState } from 'react';

import { Box, Button, Chip, Typography, Stack, SelectChangeEvent, alpha, ListItem, Tooltip, IconButton } from '@mui/material';
import { FormDialog } from '@components/form/FormDialog';
import { ProjectForm } from '@pages/Project/components/form/ProjectForm';
import AddIcon from '@mui/icons-material/Add';
import { DropDownMenu } from '@components/form/DropDownMenu';
import { BasicTable } from '@components/table/BasicTable';
import { SearchBar } from '@components/SearchBar';
import { DefaultContainedButton } from '@components/StyledComponent';
import { ArchiveIcon } from '@components/icons/ArchiveIcon';
import { CustomPopover } from '@components/CuctomPopover';
import { useSnackBar } from '@context/snackbar.context';
import { useProjectUpdateInputMutation } from '@graphql/project/project';
import { EditIcon } from '@components/icons/EditIcon';
import { ThreeDotIcon } from '@components/icons/ThreeDot';

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
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [filter, setFilter] = useState<string>('Active');
  const [updateProject] = useProjectUpdateInputMutation();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const openPopover = Boolean(anchorEl);
  const [targetRow, setTargetRow] = useState<any>();
  const { toggleSnackBar } = useSnackBar();

  const handleClickOpen = () => setOpen(true);

  const handleEditClick = (row: any) => {
    setTargetRow(row);
    handleClickOpen();
  };

  const handleOnClose = () => {
    setTargetRow(null);
    setOpen(false);
  };

  const filteredRows = data.filter((row) => {
    if (filter !== 'All') {
      return row.status.toLowerCase() === filter.toLowerCase() && row.name.toLowerCase().includes(searchText.toLowerCase());
    }
    return row && row.name.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleDropdownOnChange = (e: SelectChangeEvent<string>) => setFilter(e.target.value);

  const contractTypeColor = (id: number, type?: string, theme?: any) => {
    switch (id) {
      case 0:
        if (type === 'bg') {
          return alpha(theme.palette.grey[500], 0.16);
        } else {
          return theme.palette.mode === 'light' ? 'grey.600' : 'grey.500';
        }
      case 1:
        if (type === 'bg') {
          return alpha(theme.palette.warning.main, 0.16);
        } else {
          return theme.palette.mode === 'light' ? 'warning.dark' : 'warning.light';
        }
      case 2:
        if (type === 'bg') {
          return alpha(theme.palette.info.main, 0.16);
        } else {
          return theme.palette.mode === 'light' ? 'info.dark' : 'info.light';
        }
    }
  };

  const handleThreeDotClick = (event: React.MouseEvent<HTMLButtonElement>, row: any) => {
    setAnchorEl(event.currentTarget);
    setTargetRow(row);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleArchive = async () => {
    const { __typename, contractType, ...project } = targetRow;
    const message = project.status === 'Active' ? `Successfully archived the ${project.name}!` : `Successfully unarchived the ${project.name}!`;
    const status = project.status === 'Active' ? 'Inactive' : 'Active';
    const res = await updateProject({
      variables: {
        updateProject: { ...project, status: status, contractTypeId: contractType.id }
      }
    });
    handlePopoverClose();
    res.data?.updateProject && toggleSnackBar(message, { variant: 'success' });
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
            backgroundColor: (theme) => contractTypeColor(row.contractType.id, 'bg', theme),
            color: (theme) => contractTypeColor(row.contractType.id, 'color', theme),
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
      headerName: '',
      renderCell: (row: any) => (
        <Stack direction="row" gap={2} justifyContent="end">
          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                handleEditClick(row);
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
          <IconButton onClick={(e) => handleThreeDotClick(e, row)}>
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
        <Typography variant="h6">All Projects</Typography>
        <DefaultContainedButton variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
          New Project
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
            Add Your First Project
          </Button>
        </Box>
      )}
      <FormDialog open={open} onClose={handleOnClose}>
        <ProjectForm handleClose={handleOnClose} targetProject={targetRow} />
      </FormDialog>
      <CustomPopover open={openPopover} anchorEl={anchorEl} onClose={handlePopoverClose}>
        <ListItem sx={{ gap: 2 }} onClick={handleArchive}>
          <ArchiveIcon fontSize="small" />
          <Typography variant="body1">{targetRow?.status === 'Active' ? 'Archive' : 'Unarchive'}</Typography>
        </ListItem>
      </CustomPopover>
    </Box>
  );
};
