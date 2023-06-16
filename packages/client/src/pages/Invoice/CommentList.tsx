import React, { FC, ReactNode } from 'react';

interface CommentListProps {
  children: ReactNode;
}

export const CommentList: FC<CommentListProps> = ({ children }) => {
  return <ul>{children}</ul>;
};
