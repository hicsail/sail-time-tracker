import { Checkbox, TextField, Autocomplete, Box, Button, Typography } from '@mui/material';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useGetProjectListQuery } from '@graphql/project/project';
import { useSettings } from '@context/setting.context';
import { useAddFavoriteProjectMutation } from '@graphql/favoriteProject/favoriteProject';
import { FavoriteProjectCreateInput, ProjectModel } from '@graphql/graphql';
import { useEmployee } from '@context/employee.context';
import { GetRecordWithFavoriteProjectDocument, useGetEmployeeByIdQuery } from '@graphql/employee/employee';
import { useDate } from '@context/date.context';
import { endOfWeek, startOfWeek } from 'date-fns';
import { Banner } from '@components/Banner';
import { formatDateToDashFormat } from '../../../../utils/helperFun';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

export const CheckboxesSearch = () => {
  const [selectedProjects, setSelectedProjects] = useState<ProjectModel[]>([]);
  const [isShowBanner, setIsShowBanner] = useState(false);
  const { data } = useGetProjectListQuery();
  const [addFavoriteProjectMutation, { data: addFavoriteProjectData, loading, error }] = useAddFavoriteProjectMutation();
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

  useEffect(() => {
    // Set the displayContent state to true after a delay of 700 milliseconds (0.7 seconds)
    const timeoutId = setTimeout(() => {
      setIsShowBanner(false);
    }, 700);

    // Clean up the timeout when the component unmounts or the state changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isShowBanner]);

  // handle user select projects from search checkbox
  const handleOnChange = (e: SyntheticEvent<Element, Event>, value: any[]) => {
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
              id: employeeId as string,
              startDate: formatDateToDashFormat(startOfWeek(date, { weekStartsOn: 1 })),
              endDate: formatDateToDashFormat(endOfWeek(date, { weekStartsOn: 1 }))
            }
          }
        ]
      }).then((r) => r.data && setIsShowBanner(true));
    }
    setSelectedProjects([]);
  };

  const activeProjects = data?.projects.filter((project) => project.status === 'Active') ?? [];

  return (
    <Box>
      {isShowBanner && (
        <>
          {!loading && !error && addFavoriteProjectData && (
            <Banner content={`Successfully add ${addFavoriteProjectData.addFavoriteProject.count} favorite project`} state="success" />
          )}
          {error && <Banner content={`${error.message}`} state="error" />}
        </>
      )}
      <Typography variant="h6">Add your favorite project</Typography>
      <Autocomplete
        sx={{ marginTop: '3rem' }}
        multiple
        id="checkboxes-tags-favoriteProject"
        options={activeProjects}
        disableCloseOnSelect
        getOptionLabel={(option) => option.name}
        filterOptions={(options, { inputValue }) => {
          if (employeeData) {
            const ignoredValues = employeeData.employee.projects.map((project: any) => project.id);
            return options.filter((option) => {
              return !ignoredValues.includes(option.id) && option.name.toLowerCase().includes(inputValue.toLowerCase());
            });
          }

          return options.filter((option) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
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
        value={selectedProjects}
      />
      <Button onClick={handleOnSubmit} sx={{ width: 500, marginTop: '1rem' }} variant="contained">
        Add
      </Button>
    </Box>
  );
};
