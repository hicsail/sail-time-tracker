import { TextFieldProps } from '@mui/material';
import React, { ChangeEvent, FC } from 'react';
import TextField from '@mui/material/TextField';

type TextInputProps = {
  value: string;
  setValue: (searchText: string) => void;
} & TextFieldProps;

export const TextInput: FC<TextInputProps> = ({ value, setValue, ...otherProps }) => {
  return (
    <TextField
      {...otherProps}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
      }}
      value={value}
      sx={{
        width: '100%',
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'grey.300'
          }
        },
        '& [placeholder]': {
          fontSize: '0.9rem'
        }
      }}
    />
  );
};
