import { Checkbox, TextField, Autocomplete } from '@mui/material';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';
import { SyntheticEvent, useState } from 'react';
import { useGetProjectListQuery } from '@graphql/project/project';
import { useSettings } from '@context/setting.context';
import { useAddFavoriteProjectMutation } from '@graphql/favoriteProject/favoriteProject';
import { FavoriteProjectCreateInput, ProjectModel } from '@graphql/graphql';
import { useEmployee } from '@context/employee.context';
import { GetRecordWithFavoriteProjectDocument, useGetEmployeeByIdQuery } from '@graphql/employee/employee';
import { useDate } from '@context/date.context';
import { startOfWeek } from 'date-fns';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

export const CheckboxesSearch = () => {
  const [selectedProjects, setSelectedProjects] = useState<ProjectModel[]>([]);
  const { data } = useGetProjectListQuery();
  const [addFavoriteProjectMutation] = useAddFavoriteProjectMutation();
  const { settings } = useSettings();
  const { employeeId } = useEmployee();
  const { date } = useDate();
  const {
    data: employeeData,
    loading: employeeLoading,
    error: employeeError
  } = useGetEmployeeByIdQuery({
    variables: {
      id: employeeId as string
    }
  });

  // handle user select projects from search checkbox
  const handleOnChange = (e: SyntheticEvent<Element, Event>, value: ProjectModel[]) => {
    setSelectedProjects(value);
  };

  // handle user close search checkbox
  const handleOnSubmit = () => {
    if (settings.employee && selectedProjects) {
      const data = selectedProjects.map((selectedProject: any) => {
        return { employeeId: settings.employee, projectId: selectedProject.id };
      });

      addFavoriteProjectMutation({
        variables: {
          favoriteProject: data as FavoriteProjectCreateInput[]
        },
        refetchQueries: [
          {
            query: GetRecordWithFavoriteProjectDocument,
            variables: {
              id: employeeId,
              date: startOfWeek(date, { weekStartsOn: 1 })
            }
          }
        ]
      });
    }
    setSelectedProjects([]);
  };

  return (
    <Autocomplete
      sx={{ marginTop: '3rem' }}
      multiple
      id="checkboxes-tags-favoriteProject"
      options={data ? data.projects : []}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      filterOptions={(options) => {
        if (employeeData) {
          const ignoredValues = employeeData.employee.projects.map((project: ProjectModel) => project.id);
          return options.filter((option) => {
            return !ignoredValues.includes(option.id);
          });
        }
        return options;
      }}
      renderOption={(props, option, { selected }) => {
        return (
          <li {...props}>
            <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} disabled={selected} />
            {option.name}
          </li>
        );
      }}
      style={{ width: 500 }}
      renderInput={(params) => <TextField {...params} label="Add Your Favorite Project" placeholder="Projects" />}
      onChange={handleOnChange}
      onClose={handleOnSubmit}
      value={selectedProjects}
    />
  );
};