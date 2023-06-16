import { Box, Button, ListItem, Typography } from '@mui/material';
import { FC } from 'react';
import { format } from 'date-fns';

interface CommentListItemProps {
  title: string;
  date: Date;
  content: string;
}

export const CommentListItem: FC<CommentListItemProps> = ({ title, date, content }) => {
  const formatDate = format(date, 'dd MMM yyyy');
  return (
    <ListItem sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Box>
        <Typography variant="subtitle2" fontWeight="medium">
          {title}
        </Typography>
        <Typography variant="caption" color="secondary.light">
          {formatDate}
        </Typography>
        <Typography variant="body2">{content}</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button size="small" color="secondary">
          Delete
        </Button>
      </Box>
    </ListItem>
  );
};
