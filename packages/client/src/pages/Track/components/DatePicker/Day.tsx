import { PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/material';
import { endOfWeek, isSameDay, isWithinInterval, startOfWeek } from 'date-fns';
import { ComponentType } from 'react';

interface CustomPickerDayProps extends PickersDayProps<AdapterDateFns> {
  dayIsBetween: boolean;
  isFirstDay: boolean;
  isLastDay: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay'
})<CustomPickerDayProps>(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark
    }
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%'
  }),
  ...(isLastDay && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%'
  })
})) as ComponentType<CustomPickerDayProps>;

export const Day = (props: PickersDayProps<Date> & { selectedDay?: Date | null }) => {
  const { day, selectedDay, ...other } = props;

  if (selectedDay == null) {
    return <PickersDay day={day} {...other} />;
  }

  const start = startOfWeek(selectedDay, { weekStartsOn: 1 });
  const end = endOfWeek(selectedDay, { weekStartsOn: 1 });
  const dayIsBetween = isWithinInterval(day, { start, end });
  const isFirstDay = isSameDay(day, start);
  const isLastDay = isSameDay(day, end);

  // @ts-ignore
  return <CustomPickersDay {...other} day={day} sx={dayIsBetween ? { px: 2.5, mx: 0 } : {}} dayIsBetween={dayIsBetween} isFirstDay={isFirstDay} isLastDay={isLastDay} />;
};
