import { List, Popover, PopoverProps } from '@mui/material';
import React from 'react';

interface CustomPopoverProps extends PopoverProps {
  children: React.ReactNode;
}

export const CustomPopover = ({ children, open, onClose, anchorEl }: CustomPopoverProps) => {
  const id = open ? 'simple-popover' : undefined;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            boxShadow: (theme) =>
              theme.palette.mode === 'light'
                ? 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px'
                : 'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px;'
          }
        }
      }}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'right'
      }}
    >
      <List sx={{ '& .MuiListItem-root': { cursor: 'pointer' } }}>{children}</List>
    </Popover>
  );
};
