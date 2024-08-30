import { IconButton } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';

export interface ExpandButtonProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const ExpandButton: React.FC<ExpandButtonProps> = ({ open, setOpen }) => {
  return (
    <IconButton size="small" onClick={() => setOpen(!open)}>
      {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />  }
    </IconButton>
  );
};
