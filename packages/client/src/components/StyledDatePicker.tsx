import { CustomDatePickerLayout } from '@pages/Track/components/DatePicker/CustomDatePickerLayout';
import { DatePicker } from '@mui/x-date-pickers';
import { DatePickerProps } from '@mui/lab';
import { FC } from 'react';

interface StyledDatePickerProps extends DatePickerProps<any> {}
export const StyledDatePicker: FC<StyledDatePickerProps> = (props) => {
  return (
    <DatePicker
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'grey.300',
            color: 'grey.500'
          }
        }
      }}
      slots={{ layout: CustomDatePickerLayout }}
      {...props}
    />
  );
};
