import { Checkbox, TextField, Autocomplete } from '@mui/material';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';
import { SyntheticEvent, useState } from 'react';
import { useGetProjectListQuery } from '@graphql/project/project';
import { useSettings } from '@context/setting.context';
import { useAddFavoriteProjectMutation } from '@graphql/favoriteProject/favoriteProject';
import { FavoriteProjectCreateInput } from '@graphql/graphql';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

export const CheckboxesSearch = () => {
  const [selectedProjects, setSelectedProjects] = useState<{ projectId: string; employeeId: string | null | undefined }[]>();
  const { data } = useGetProjectListQuery();
  const [addFavoriteProjectMutation] = useAddFavoriteProjectMutation();
  const { settings } = useSettings();

  // handle user select projects from search checkbox
  const handleOnChange = (e: SyntheticEvent<Element, Event>, value: any) => {
    if (settings.employee) {
      const data = value.map((v: any) => {
        return { employeeId: settings.employee, projectId: v.id };
      });
      setSelectedProjects(data);
    } else {
      console.log('please choose employee');
    }
  };

  // handle user close search checkbox
  const handleOnSubmit = () => {
    if (settings.employee) {
      addFavoriteProjectMutation({
        variables: {
          favoriteProject: selectedProjects as FavoriteProjectCreateInput[]
        }
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
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
          {option.name}
        </li>
      )}
      style={{ width: 500 }}
      renderInput={(params) => <TextField {...params} label="Add Your Favorite Project" placeholder="Projects" />}
      onChange={(e, value) => {
        handleOnChange(e, value);
      }}
      onClose={handleOnSubmit}
    />
  );
};
