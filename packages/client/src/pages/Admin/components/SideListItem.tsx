import { ListItem, ListItemButton, ListItemText, ListItemIcon, alpha } from '@mui/material';
import { FC, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface SideListItemProps {
  path: string;
  icon?: ReactNode;
  info: string;
}

export const SideListItem: FC<SideListItemProps> = ({ path, icon, info }) => {
  return (
    <ListItem
      disablePadding
      sx={{
        '&:hover': {
          backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'grey.100' : alpha(theme.palette.grey[500], 0.02))
        }
      }}
    >
      <ListItemButton
        component={NavLink}
        to={path}
        sx={{
          borderRadius: '8px',
          '&.active': {
            color: (theme) => (theme.palette.mode === 'light' ? 'primary.main' : 'primary.light'),
            '& .MuiSvgIcon-root': { color: (theme) => (theme.palette.mode === 'light' ? 'primary.main' : 'primary.light') },
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08)
          }
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={info} />
      </ListItemButton>
    </ListItem>
  );
};
