import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

import { EnhancedTableToolbar } from '@pages/Project/components/table/EnhancedTableToolbar';
import { EnhancedTableHead } from '@pages/Project/components/table/EnhencedTableHead';
import { ProjectModel } from '@graphql/graphql';
import { Paths } from '@constants/paths';
import { FormDialog } from '@pages/Project/components/form/FormDialog';

interface ProjectTableProps {
  rows: ProjectModel[];
}

export const ProjectTable: FC<ProjectTableProps> = ({ rows }) => {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  /**
   * this method is used to handle model open and close
   */
  const handleClickOpen = () => {
    setOpen(true);
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

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          mb: 2,
          backgroundColor: 'customColors.sidebarBg',
          padding: '1rem'
        }}
      >
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} setSelected={setSelected} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead numSelected={selected.length} onSelectAllClick={handleSelectAllClick} rowCount={rows.length} />
            <TableBody>
              {rows.map((row, index) => {
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
                    <TableCell align="left" sx={{ width: '100px', paddingRight: '3rem' }}>
                      <Chip
                        label={row.status}
                        sx={{
                          backgroundColor: 'customColors.statusBtnBg',
                          color: 'customColors.statusBtnText',
                          padding: '0 10px'
                        }}
                      />
                    </TableCell>
                    <TableCell align="left" sx={{ width: '100px', paddingRight: '3rem' }}>
                      <Chip
                        label={row.isBillable.toString()}
                        sx={{
                          backgroundColor: 'customColors.statusBtnBg',
                          color: 'customColors.statusBtnText',
                          padding: '0 10px'
                        }}
                      />
                    </TableCell>
                    <TableCell align="left" sx={{ border: 'none', width: '100px', underline: 'none' }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          navigate(`${Paths.PROJECT_lIST}/${row.id}`);
                          handleClickOpen();
                        }}
                      >
                        Edit
                      </Button>
                      <FormDialog open={open} setOpen={setOpen} title="Edit Project" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {rows.length == 0 && (
          <Box>
            <Button sx={{ width: '100%', height: '200px', fontSize: '1.2rem' }} onClick={handleClickOpen}>
              Add Your First Project
            </Button>
            <FormDialog open={open} setOpen={setOpen} title="Add Project" />
          </Box>
        )}
      </Paper>
    </Box>
  );
};
