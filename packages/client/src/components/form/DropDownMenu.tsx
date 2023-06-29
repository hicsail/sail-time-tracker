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
      <InputLabel sx={{ '&.Mui-focused': { color: (theme: any) => (theme.palette.mode === 'light' ? theme.palette.grey[600] : theme.palette.common.white) } }}>{label}</InputLabel>
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
          fontSize: '0.9rem',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: (theme: any) => (theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.common.white)
          }
        }}
        inputProps={{
          MenuProps: {
            MenuListProps: {
              sx: {
                backgroundColor: (theme: any) => (theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey[800]),
                padding: '0.3rem'
              }
            }
          }
        }}
      >
        {data &&
          data.map((item: any) => {
            return (
              <MenuItem
                key={item.id}
                value={item.id}
                sx={{
                  margin: '0.3rem 0',
                  '&.Mui-selected': {
                    backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'rgba(223,227,232, 0.6)' : 'rgba(69, 79, 91, 0.5)'),
                    borderRadius: '5px'
                  },
                  '&:hover': { backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'rgba(223,227,232, 0.3)' : 'rgba(69, 79, 91, 0.2)'), borderRadius: '5px' }
                }}
              >
                {item.name}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
};
