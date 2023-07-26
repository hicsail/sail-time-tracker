import { Checkbox, Autocomplete, Box, Typography, Stack, ListItem } from '@mui/material';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';
import { FC, SyntheticEvent, useState } from 'react';
import { useGetProjectListQuery } from '@graphql/project/project';
import { useSettings } from '@context/setting.context';
import { useAddFavoriteProjectMutation } from '@graphql/favoriteProject/favoriteProject';
import { FavoriteProjectCreateInput } from '@graphql/graphql';
import { useEmployee } from '@context/employee.context';
import { GetRecordWithFavoriteProjectDocument } from '@graphql/employee/employee';
import { useDate } from '@context/date.context';
import { endOfWeek, startOfWeek } from 'date-fns';
import { Banner } from '@components/Banner';
import { formatDateToDashFormat } from '../../../../utils/helperFun';
import { CustomOutlinedTextInput, DefaultContainedButton, DefaultOutlinedButton } from '@components/StyledComponent';
import { useTimeout } from '../../../../hooks/useTimeOutHook';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

interface CheckboxesSearchProps {
  data: any[] | undefined;
  onClose: () => void;
}

export const CheckboxesSearch: FC<CheckboxesSearchProps> = ({ data, onClose }) => {
  const [selectedProjects, setSelectedProjects] = useState<any[]>([]);
  const [isShowBanner, setIsShowBanner] = useState(false);
  const { data: projectListDate } = useGetProjectListQuery();
  const [addFavoriteProjectMutation, { data: addFavoriteProjectData, loading, error }] = useAddFavoriteProjectMutation();
  const { settings } = useSettings();
  const { employeeId } = useEmployee();
  const { date } = useDate();

  useTimeout(() => setIsShowBanner(false), 1000, isShowBanner);

  // handle user select projects from search checkbox
  const handleOnChange = (e: SyntheticEvent<Element, Event>, value: any[]) => {
    setSelectedProjects(value);
  };

  // handle add favorite project event
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
        sx={{ marginTop: '3rem', width: 500, backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey['800']) }}
        multiple
        id="checkboxes-tags-favoriteProject"
        options={projectListDate?.projects ?? []}
        disableCloseOnSelect
        getOptionLabel={(option) => option.name}
        filterOptions={(options, { inputValue }) => {
          if (data) {
            const ignoredValues = data.map((project) => project.projectId);

            return options.filter((option) => {
              return !ignoredValues.includes(option.id) && option.name.toLowerCase().includes(inputValue.toLowerCase()) && option.status === 'Active';
            });
          }

          return options.filter((option) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
        }}
        renderOption={(props, option, { selected }) => {
          return (
            <ListItem {...props} sx={{ backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey['800']) }}>
              <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} disabled={selected} />
              {option.name}
            </ListItem>
          );
        }}
        renderInput={(params) => <CustomOutlinedTextInput {...params} label="Add Your Favorite Project" placeholder="Projects" />}
        onChange={handleOnChange}
        value={selectedProjects}
      />
      <Stack sx={{ width: 500, marginTop: '1rem' }} gap={2}>
        <DefaultContainedButton onClick={handleOnSubmit} variant="contained" color="primary">
          Add
        </DefaultContainedButton>
        <DefaultOutlinedButton variant="outlined" onClick={onClose}>
          close
        </DefaultOutlinedButton>
      </Stack>
    </Box>
  );
};
