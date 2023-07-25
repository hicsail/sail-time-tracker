import { TextInput } from '@components/TextInput';
import { InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { FC } from 'react';

interface SearchBarProps {
  value: string;
  setValue: (value: string) => void;
  id: string;
}

export const SearchBar: FC<SearchBarProps> = ({ value, setValue, id }) => {
  return (
    <TextInput
      value={value}
      setValue={setValue}
      id={id}
      variant="outlined"
      placeholder="Search..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ mr: 1, color: 'grey.500' }} />
          </InputAdornment>
        )
      }}
    />
  );
};
