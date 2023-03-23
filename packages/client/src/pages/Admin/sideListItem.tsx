import { ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import React, { FC } from 'react';

interface SideListItemProps {
  path: string;
  icon?: React.ReactNode;
  info: string;
}

export const SideListItem: FC<SideListItemProps> = ({ path, icon, info }) => {
  return (
    <ListItem disablePadding>
      <ListItemButton href={path}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={info} />
      </ListItemButton>
    </ListItem>
  );
};
