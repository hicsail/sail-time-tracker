import { ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface SideListItemProps {
  path: string;
  icon?: React.ReactNode;
  info: string;
}

export const SideListItem: FC<SideListItemProps> = ({ path, icon, info }) => {
  const navigate = useNavigate();
  return (
    <ListItem
      disablePadding
      sx={{
        '&:hover': {
          '& .MuiSvgIcon-root': { color: 'customColors.iconHoverColor' },
          backgroundColor: 'customColors.listNavHoverColor'
        }
      }}
    >
      <ListItemButton onClick={() => navigate(path)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={info} />
      </ListItemButton>
    </ListItem>
  );
};
