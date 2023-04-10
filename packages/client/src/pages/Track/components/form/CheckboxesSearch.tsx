import { Checkbox, TextField, Autocomplete } from '@mui/material';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';
import { SyntheticEvent, useState } from 'react';
import { useGetProjectListQuery } from '@graphql/project/project';
import { useSettings } from '@context/setting.context';
import { useAddFavoriteProjectMutation } from '@graphql/favoriteProject/favoriteProject';
import { FavoriteProjectCreateInput, ProjectModel } from '@graphql/graphql';
import { useEmployee } from '@context/employee.context';
import { GetEmployeeByIdDocument } from '@graphql/employee/employee';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

export const CheckboxesSearch = () => {
  const [selectedProjects, setSelectedProjects] = useState<{ projectId: string; employeeId: string | null | undefined }[]>();
  const { data } = useGetProjectListQuery();
  const [addFavoriteProjectMutation] = useAddFavoriteProjectMutation();
  const { settings } = useSettings();
  const { employeeId } = useEmployee();

  const {
    employeeData: {
      employee: { projects }
    }
  } = useEmployee();

  // handle user select projects from search checkbox
  const handleOnChange = (e: SyntheticEvent<Element, Event>, value: any) => {
    if (settings.employee) {
      const data = value.map((selectedProject: any) => {
        return { employeeId: settings.employee, projectId: selectedProject.id };
      });
      setSelectedProjects(data);
    }
  };

  // handle user close search checkbox
  const handleOnSubmit = () => {
    if (settings.employee && selectedProjects) {
      addFavoriteProjectMutation({
        variables: {
          favoriteProject: selectedProjects as FavoriteProjectCreateInput[]
        },
        refetchQueries: [
          {
            query: GetEmployeeByIdDocument,
            variables: {
              id: employeeId
            }
          }
        ]
      });
    }
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
        const ignoredValues = projects.map((project: ProjectModel) => project.id);
        return options.filter((option) => {
          return !ignoredValues.includes(option.id);
        });
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
      onChange={(e, value) => {
        handleOnChange(e, value);
      }}
      onClose={handleOnSubmit}
      clearOnBlur={true}
    />
  );
};
