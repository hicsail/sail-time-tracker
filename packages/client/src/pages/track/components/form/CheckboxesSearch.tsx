import { Checkbox, Autocomplete, Box, Typography, Stack, ListItem, Chip } from '@mui/material';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';
import { FC, SyntheticEvent, useState } from 'react';
import { useGetProjectListQuery } from '@graphql/project/project';
import { useAddFavoriteProjectMutation, useDeleteFavoriteProjectMutation } from '@graphql/favorite-project/favoriteProject';
import { useEmployee } from '@context/employee.context';
import { GetRecordWithFavoriteProjectDocument } from '@graphql/employee/employee';
import { useDate } from '@context/date.context';
import { endOfWeek, startOfWeek } from 'date-fns';
import { formatDateToDashFormat } from '../../../../utils/helperFun';
import { CustomOutlinedTextInput, DefaultContainedButton } from '@components/StyledComponent';
import { useSnackBar } from '@context/snackbar.context';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

interface CheckboxesSearchProps {
  excludedData: any[] | undefined;
  onClose: () => void;
}

export const CheckboxesSearch: FC<CheckboxesSearchProps> = ({ excludedData, onClose }) => {
  const [selectedProjects, setSelectedProjects] = useState<any[]>([]);
  const { data: projectListDate } = useGetProjectListQuery();
  const activeProjects = projectListDate?.projects?.filter((project) => project.status === 'Active') ?? [];
  const [addFavoriteProjectMutation, { error: addFavoriteProjectError }] = useAddFavoriteProjectMutation();
  const [deleteFavoriteProject] = useDeleteFavoriteProjectMutation();
  const { employeeId } = useEmployee();
  const { date } = useDate();
  const { toggleSnackBar } = useSnackBar();

  // handle user select projects from search checkbox
  const handleOnChange = (e: SyntheticEvent<Element, Event>, value: any[]) => {
    if (employeeId) {
      const newFavoriteProjects = value.map((project: any) => ({ employeeId: employeeId, projectId: project.id }));

      addFavoriteProjectMutation({
        variables: {
          favoriteProject: newFavoriteProjects
        },
        refetchQueries: [
          {
            query: GetRecordWithFavoriteProjectDocument,
            variables: {
              id: employeeId,
              startDate: formatDateToDashFormat(startOfWeek(date, { weekStartsOn: 1 })),
              endDate: formatDateToDashFormat(endOfWeek(date, { weekStartsOn: 1 }))
            }
          }
        ]
      }).then((r) => {
        const response = r?.data?.addFavoriteProject;
        response && response.count > 0 && toggleSnackBar(`Successfully add ${response?.count} favorite project`, { variant: 'success' });
        addFavoriteProjectError && toggleSnackBar('Something went wrong!', { variant: 'error' });
      });
      setSelectedProjects(value);
    }
  };

  const handleOnClickUnFavorite = (projectId: string) => {
    if (employeeId && projectId) {
      deleteFavoriteProject({
        variables: {
          employeeId: employeeId,
          projectIds: [projectId]
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
      const filteredSelected = selectedProjects.filter((project) => project.id !== projectId);
      setSelectedProjects(filteredSelected);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Add your favorite project</Typography>
      <Autocomplete
        sx={{ marginTop: '3rem', width: 500, backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey['800']) }}
        multiple
        id="checkboxes-tags-favoriteProject"
        options={activeProjects}
        disableCloseOnSelect
        getOptionLabel={(option) => option.name}
        filterOptions={(options, { inputValue }) => {
          if (excludedData) {
            const ignoredValues = excludedData.map((project) => project.projectId);

            return options.filter((option) => {
              return !ignoredValues.includes(option.id) && option.name.toLowerCase().includes(inputValue.toLowerCase());
            });
          }

          return options.filter((option) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
        }}
        renderOption={(props, option, { selected }) => {
          return (
            <ListItem {...props} sx={{ backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey['800']) }}>
              <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} disabled={selected} />
              {option.name}
            </ListItem>
          );
        }}
        renderInput={(params) => <CustomOutlinedTextInput {...params} label="Add Your Favorite Project" placeholder="Projects" />}
        renderTags={(tagValue, getTagProps) => {
          return tagValue.map((option, index) => <Chip {...getTagProps({ index })} label={option.name} onDelete={() => handleOnClickUnFavorite(option.id)} />);
        }}
        onChange={handleOnChange}
        value={selectedProjects}
      />
      <Stack sx={{ width: 500, marginTop: '1rem' }}>
        <DefaultContainedButton variant="contained" onClick={onClose}>
          close
        </DefaultContainedButton>
      </Stack>
    </Box>
  );
};
