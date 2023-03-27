import TextField from '@mui/material/TextField';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';

export const DatePickerComponent = () => {
  const now = new Date();

  const [value, setValue] = useState(now);

  return (
    <DatePicker
      label="Date"
      value={value}
      onChange={(newValue) => {
        setValue(newValue as Date);
      }}
      renderInput={(params) => <TextField {...params} />}
    />
  );
};
