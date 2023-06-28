import * as Yup from 'yup';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableRow, Checkbox, Typography, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Save } from '@mui/icons-material';
import React, { ChangeEvent, useState, MouseEvent, FC } from 'react';
import { EnhancedTableHead } from '@pages/Track/components/table/EnhancedTableHead';

import { Form, Formik } from 'formik';
import { useDate } from '@context/date.context';
import { useEmployee } from '@context/employee.context';
import { GetRecordWithFavoriteProjectDocument } from '@graphql/employee/employee';
import { StyledPaper } from '@components/StyledPaper';
import { ObserverTextInput } from '@components/form/ObserverTextInput';
import { FormObserver } from '@pages/Track/components/table/FormObserver';
import { formatDateToDashFormat, getMondayToSundayDates } from '../../../../utils/helperFun';
import { endOfWeek, startOfWeek } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import { FormDialog } from '@components/form/FormDialog';
import { Paths } from '@constants/paths';
import { CheckboxesSearch } from '@pages/Track/components/form/CheckboxesSearch';
import { useNavigate } from 'react-router-dom';
import { TableHeadCover } from '@pages/Employee/components/table/TableHeadCover';
import { useDeleteFavoriteProjectMutation } from '@graphql/favoriteProject/favoriteProject';

export interface Data {
  id: string;
  name: string;
  hours?: number;
  description: string;
  status: string;
  isFavorite: boolean;
  previousWeek?: number;
}

interface ProjectTableProps {
  data: any | undefined;
}

export const ProjectTable: FC<ProjectTableProps> = ({ data }) => {
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState({
    add: false,
    edit: false
  });
  const { employeeId } = useEmployee();
  const navigate = useNavigate();
  const { date } = useDate();
  const dates = getMondayToSundayDates(date);
  const rows = data || [];
  const [deleteFavoriteProject, { error }] = useDeleteFavoriteProjectMutation();

  const FormValidation = Yup.object({
    hours: Yup.number().required('Required').min(0, 'Hours can not be negative.')
  });

  const handleClickOpen = (type: string) => {
    setOpen((prevState) => ({ ...prevState, [type]: true }));
  };

  const handleOnClose = (type: string) => {
    setOpen((prevState) => ({ ...prevState, [type]: false }));
    navigate(Paths.TRACK);
  };

  /**
   * this method is used to handle select all project event.
   * @param event
   */
  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const filteredSelected = rows.filter((row: any, index: number) => index !== 1 && index !== 0).map((row: any) => row.projectId);
      setSelected(filteredSelected);
      return;
    }
    setSelected([]);
  };

  /**
   * this method is used to handle select single project event.
   * @param event
   * @param id
   */
  const handleClick = (event: MouseEvent<unknown>, id: string) => {
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

  const handleOnClickDelete = async () => {
    if (employeeId && selected.length > 0) {
      deleteFavoriteProject({
        variables: {
          employeeId: employeeId,
          projectIds: selected as string[]
        },
        refetchQueries: [
          {
            query: GetRecordWithFavoriteProjectDocument,
            variables: {
              id: employeeId as string,
              startDate: formatDateToDashFormat(startOfWeek(date, { weekStartsOn: 1 })),
              endDate: formatDateToDashFormat(endOfWeek(date, { weekStartsOn: 1 }))
            }
          }
        ]
      });
    }

    setSelected([]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <StyledPaper elevation={0}>
        <Stack direction="row" width="100%" justifyContent="space-between" marginBottom={5}>
          <Typography variant="h6">Favorite Projects</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: '8px', backgroundColor: 'grey.800', '&:hover': { backgroundColor: 'grey.700' } }}
            onClick={() => handleClickOpen('add')}
          >
            Add Favorite Project
          </Button>
          <FormDialog open={open.add} onClose={() => handleOnClose('add')}>
            <CheckboxesSearch data={data} />
          </FormDialog>
        </Stack>
        <TableContainer>
          <Table sx={{ minWidth: 750, position: 'relative' }} aria-labelledby="tableTitle">
            <TableHeadCover
              rowCount={rows.length - 2}
              selected={selected}
              setSelected={setSelected}
              handleSelectAllClick={handleSelectAllClick}
              handleClickDelete={handleOnClickDelete}
            />
            <EnhancedTableHead numSelected={selected.length} onSelectAllClick={handleSelectAllClick} rowCount={rows.length - 2} dates={dates} />
            <TableBody>
              {rows.map((row: any, index: number) => {
                const isItemSelected = isSelected(row.projectId);
                const labelId = `enhanced-table-checkbox-${row.projectId}`;

                // total hours for each project in a week
                const totalHours = row.records.reduce((totalHours: number, record: any) => {
                  return totalHours + record.hours;
                }, 0);

                return (
                  <TableRow hover role="checkbox" key={row.projectId} selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onClick={(event) => handleClick(event, row.projectId)}
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                        disabled={row.projectName === 'Indirect' || row.projectName === 'Absence'}
                      />
                    </TableCell>
                    <TableCell id="name" scope="row" padding="none" sx={{ width: '120px' }}>
                      {row.projectName}
                    </TableCell>
                    {dates.map((dateValue) => {
                      // store hours for each date in a map.
                      const dateHoursMap = new Map();
                      row.records.forEach((record: any) => {
                        if (!dateHoursMap.has(record.date)) {
                          dateHoursMap.set(record.date, record.hours);
                        }
                      });

                      return (
                        <TableCell scope="row" padding="normal" key={dateValue.dateOfMonth}>
                          <Formik
                            validateOnChange={true}
                            initialValues={{ [dateValue.date]: dateHoursMap.get(dateValue.date) || '' }}
                            validationSchema={FormValidation}
                            enableReinitialize={true}
                            onSubmit={() => {}}
                          >
                            <Form>
                              <FormObserver employeeId={employeeId as string} projectId={row.projectId} date={date} setLoading={setLoading} id={dateValue.date} />
                              <ObserverTextInput
                                name={dateValue.date}
                                type="number"
                                variant="outlined"
                                InputProps={{ inputProps: { min: 0 } }}
                                required
                                sx={{ '& fieldset': { border: 'none' }, backgroundColor: 'grey.100', borderRadius: '5%' }}
                              />
                            </Form>
                          </Formik>
                        </TableCell>
                      );
                    })}
                    <TableCell align="left" sx={{ width: '100px' }}>
                      {totalHours}
                    </TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {rows.length == 0 && <Button sx={{ width: '100%', height: '200px', fontSize: '1.2rem' }}>Add Your First Favorite Project</Button>}
      </StyledPaper>

      <LoadingButton color="primary" loading={loading} loadingPosition="start" startIcon={<Save />} variant="contained">
        <span>Save</span>
      </LoadingButton>
    </Box>
  );
};
