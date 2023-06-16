import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

interface CommentDisplayComponentProps {
  children: ReactNode;
}

export const CommentDisplayComponent: FC<CommentDisplayComponentProps> = ({ children }) => {
  return <Box>{children}</Box>;
};
