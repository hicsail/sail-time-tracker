import { Box, Button, ListItem, Typography } from '@mui/material';
import { FC } from 'react';
import { format } from 'date-fns';

interface CommentListItemProps {
  title: string;
  date: Date;
  content: string;
  onDelete: () => void;
}

export const CommentListItem: FC<CommentListItemProps> = ({ date, content, onDelete }) => {
  const formatDate = format(date, 'dd MMM yyyy');

  return (
    <ListItem sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Box>
        <Typography variant="caption" color="secondary.light">
          {formatDate}
        </Typography>
        <Typography variant="body2">{content}</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button size="small" color="secondary" onClick={onDelete}>
          Delete
        </Button>
      </Box>
    </ListItem>
  );
};
