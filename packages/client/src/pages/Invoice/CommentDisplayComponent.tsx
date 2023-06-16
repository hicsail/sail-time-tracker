import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import { CommentList } from '@pages/Invoice/CommentList';
import { CommentListItem } from '@pages/Invoice/CommentListItem';
import { useDeleteCommentMutation } from '@graphql/comment/comment';

interface CommentDisplayComponentProps {
  children: ReactNode;
}

export const CommentDisplayComponent: FC<CommentDisplayComponentProps> = ({ children }) => {
  return <Box>{children}</Box>;
};
