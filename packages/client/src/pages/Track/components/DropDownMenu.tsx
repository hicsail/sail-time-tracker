import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { FC } from 'react';

interface DropDownMenuProps<T> {
  data: T[] | undefined;
  onChange: (e: SelectChangeEvent) => void;
  defaultValue: string | null;
  label: string;
  name: string;
  id: string;
}

export const DropDownMenu: FC<DropDownMenuProps<any>> = ({ data, onChange, defaultValue, label, name, id }) => {
  return (
    <FormControl sx={{ minWidth: '200px' }}>
      <InputLabel id="employee_select-label">{label}</InputLabel>
      <Select name={name} label={label} id={id} onChange={onChange} value={defaultValue as string}>
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
