import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import { FC } from 'react';
import { StyledPaper } from '@components/StyledPaper';

interface CheckboxListProps {
  data: any[] | undefined;
}
export const CheckboxList: FC<CheckboxListProps> = ({ data }) => {
  const [checked, setChecked] = React.useState(data || [0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <StyledPaper>
      <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: 200, overflow: 'auto' }}>
        {data?.map((value) => {
          const labelId = `checkbox-list-label-${value}`;

          return (
            <ListItem key={value.id} disablePadding>
              <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                <ListItemIcon>
                  <Checkbox edge="start" checked={checked.indexOf(value) !== -1} tabIndex={-1} disableRipple inputProps={{ 'aria-labelledby': labelId }} />
                </ListItemIcon>
                <ListItemText id={value.id} primary={`${value.name}`} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </StyledPaper>
  );
};
