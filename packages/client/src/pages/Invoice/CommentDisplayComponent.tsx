import { Box, Button, List, ListItem, Typography } from '@mui/material';
import { FC } from 'react';
import { CommentList } from '@pages/Invoice/CommentList';
import { CommentListItem } from '@pages/Invoice/CommentListItem';

interface CommentDisplayComponentProps {
  items: any;
}

export const CommentDisplayComponent: FC<CommentDisplayComponentProps> = ({ items }) => {
  return (
    <Box>
      <CommentList>
        {items &&
          items.map((item: any) => {
            return <CommentListItem title="Xinyue Chen" date={new Date(item.createDate)} content={item.content} />;
          })}
      </CommentList>
    </Box>
  );
};
