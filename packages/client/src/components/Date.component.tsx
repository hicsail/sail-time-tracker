import TextField from '@mui/material/TextField';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';

export const Date = () => {
  const [value, setValue] = useState(null);

  return (
    <DatePicker
      label="Date"
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      renderInput={(params) => <TextField {...params} />}
    />
  );
};
