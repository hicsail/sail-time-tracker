import { ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { FC, ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface SideListItemProps {
  path: string;
  icon?: ReactNode;
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
          backgroundColor: 'rgba(145, 158, 171, 0.02)'
        }
      }}
    >
      <ListItemButton
        component={NavLink}
        to={path}
        sx={{
          borderRadius: '8px',
          '&.active': {
            color: 'grey.800',
            '& .MuiSvgIcon-root': { color: 'grey.800' }
          }
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={info} />
      </ListItemButton>
    </ListItem>
  );
};
