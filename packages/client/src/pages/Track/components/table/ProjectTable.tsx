import * as Yup from 'yup';
import { Table, TableBody, TableCell, TableContainer, TableRow, Checkbox, Typography, Stack, TableFooter } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { ChangeEvent, useState, MouseEvent, FC } from 'react';
import { EnhancedTableHead } from '@pages/Track/components/table/EnhancedTableHead';

import { Form, Formik } from 'formik';
import { useDate } from '@context/date.context';
import { useEmployee } from '@context/employee.context';
import { GetRecordWithFavoriteProjectDocument } from '@graphql/employee/employee';
import { StyledPaper } from '@components/StyledPaper';
import { ObserverTextInput } from '@components/form/ObserverTextInput';
import { FormObserver } from '@pages/Track/components/form/FormObserver';
import { formatDateToDashFormat, getMondayToSundayDates } from '../../../../utils/helperFun';
import { endOfWeek, startOfWeek } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import { FormDialog } from '@components/form/FormDialog';
import { CheckboxesSearch } from '@pages/Track/components/form/CheckboxesSearch';
import { TableHeadCover } from '@pages/Track/components/table/TableHeadCover';
import { useDeleteFavoriteProjectMutation } from '@graphql/favoriteProject/favoriteProject';
import { DefaultContainedButton, StyledTableBox } from '@components/StyledComponent';
import { useSnackBar } from '@context/snackbar.context';
import { useDeleteRecordMutation } from '@graphql/record/record';

interface ProjectTableProps {
  data: any | undefined;
}

export const ProjectTable: FC<ProjectTableProps> = ({ data }) => {
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { employeeId } = useEmployee();
  const { date } = useDate();
  const dates = getMondayToSundayDates(date);
  const rows = data || [];
  const rowCount = rows.length - 2;
  const [deleteFavoriteProject] = useDeleteFavoriteProjectMutation();
  const { toggleSnackBar } = useSnackBar();
  const [deleteRecord] = useDeleteRecordMutation();

  const handleClickOpen = () => setOpen(true);

  const handleOnClose = () => {
    setOpen(false);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // exclude the first two rows (Indirect and Absence)
      // exclude the rows that have total hours > 0
      const filteredSelected = rows
        .filter((row: any, index: number) => {
          const totalHours = row.records.reduce((totalHours: number, record: any) => totalHours + record.hours, 0);
          return index !== 1 && index !== 0 && totalHours === 0;
        })
        .map((row: any) => row.projectId);
      setSelected(filteredSelected);
      return;
    }
    setSelected([]);
  };

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

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const handleOnClickUnFavorite = () => {
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
      }).then((r) => {
        const response = r?.data?.deleteFavoriteProjects;
        response && response.count > 0 && toggleSnackBar(`Successfully unfavorite ${response?.count} projects`, { variant: 'success' });
        !response && toggleSnackBar('Something went wrong!', { variant: 'error' });
      });

      // delete records of the unfavorite projects that has 0 hours
      deleteRecord({
        variables: {
          input: {
            employeeId: employeeId,
            projectIds: selected as string[],
            startDate: formatDateToDashFormat(startOfWeek(date, { weekStartsOn: 1 })),
            endDate: formatDateToDashFormat(endOfWeek(date, { weekStartsOn: 1 }))
          }
        }
      });
    }

    setSelected([]);
  };

  return (
    <StyledTableBox>
      <StyledPaper elevation={0} sx={{ display: 'flex', gap: 5 }}>
        <Stack direction="row" width="100%" justifyContent="space-between">
          <Typography variant="h6">Favorite Projects</Typography>
          <DefaultContainedButton variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
            Add Favorite Project
          </DefaultContainedButton>
          <FormDialog open={open} onClose={handleOnClose}>
            <CheckboxesSearch excludedData={data} onClose={handleOnClose} />
          </FormDialog>
        </Stack>
        <TableContainer>
          <Table sx={{ position: 'relative' }} aria-labelledby="tableTitle">
            <TableHeadCover
              rowCount={rowCount}
              selected={selected}
              setSelected={setSelected}
              handleSelectAllClick={handleSelectAllClick}
              handleClickDelete={handleOnClickUnFavorite}
            />
            <EnhancedTableHead numSelected={selected.length} onSelectAllClick={handleSelectAllClick} rowCount={rowCount} dates={dates} />
            <TableBody>
              {rows.map((row: any) => {
                const isItemSelected = isSelected(row.projectId);

                // total hours for each project in a week
                const totalHours = row.records.reduce((totalHours: number, record: any) => totalHours + record.hours, 0);

                return (
                  <TableRow hover role="checkbox" key={row.projectId} selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onClick={(event) => handleClick(event, row.projectId)}
                        disabled={row.projectName === 'Indirect' || row.projectName === 'Absence' || totalHours !== 0}
                      />
                    </TableCell>
                    <TableCell id="name">{row.projectName}</TableCell>
                    {dates.map((dateValue) => {
                      const FormValidation = Yup.object({
                        [dateValue.date]: Yup.number().min(0, 'can not be negative.')
                      });

                      const initialHours = row.records.find((record: any) => record.date === dateValue.date)?.hours || '';

                      return (
                        <TableCell key={dateValue.dateOfMonth}>
                          <Formik
                            validateOnChange={true}
                            initialValues={{ [dateValue.date]: initialHours }}
                            validationSchema={FormValidation}
                            enableReinitialize={true}
                            onSubmit={() => {}}
                          >
                            <Form>
                              <FormObserver employeeId={employeeId as string} projectId={row.projectId} setLoading={setLoading} id={dateValue.date} />
                              <ObserverTextInput name={dateValue.date} type="number" />
                            </Form>
                          </Formik>
                        </TableCell>
                      );
                    })}
                    <TableCell>{totalHours}</TableCell>
                    <TableCell>{row.description}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TableFooter>
          <LoadingButton color="primary" loading={loading} loadingPosition="start" startIcon={<FiberManualRecordIcon />} variant="text" sx={{ pointerEvents: 'none' }}>
            <span>{loading ? 'Saving' : 'Saved'}</span>
          </LoadingButton>
        </TableFooter>
      </StyledPaper>
    </StyledTableBox>
  );
};
