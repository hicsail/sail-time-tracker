import { DateView, pickersLayoutClasses, PickersLayoutContentWrapper, PickersLayoutProps, PickersLayoutRoot, usePickerLayout } from '@mui/x-date-pickers';

export const CustomDatePickerLayout = (props: PickersLayoutProps<Date | null, Date, DateView>) => {
  const { content } = usePickerLayout(props);

  return (
    <PickersLayoutRoot ownerState={props} sx={{ backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey[800]) }}>
      <PickersLayoutContentWrapper className={pickersLayoutClasses.contentWrapper}>{content}</PickersLayoutContentWrapper>
    </PickersLayoutRoot>
  );
};
