import { ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <ListItemButton onClick={() => navigate(path)} sx={{ borderRadius: '8px' }}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={info} />
      </ListItemButton>
    </ListItem>
  );
};
