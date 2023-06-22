import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { FC } from 'react';

interface DropDownMenuProps<T> {
  data: T[] | undefined;
  onChange: (e: SelectChangeEvent) => void;
  label: string;
  name: string;
  id: string;
  value: string;
}

export const DropDownMenu: FC<DropDownMenuProps<any>> = ({ data, onChange, label, name, id, value }) => {
  return (
    <FormControl sx={{ minWidth: '200px' }}>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        label={label}
        id={id}
        onChange={onChange}
        value={value}
        IconComponent={KeyboardArrowDownIcon}
        sx={{
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'grey.300'
          },
          color: 'grey.500',
          fontSize: '0.9rem'
        }}
      >
        {data &&
          data.map((item: any) => {
            return (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
};
