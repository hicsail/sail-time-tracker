import TextField from '@mui/material/TextField';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDate } from '@context/date.context';

export const DatePickerComponent = () => {
  const { date, setDate } = useDate();

  return (
    <DatePicker
      label="Date"
      value={date}
      onChange={(newValue) => {
        setDate(newValue as Date);
      }}
      renderInput={(params) => <TextField {...params} />}
    />
  );
};
