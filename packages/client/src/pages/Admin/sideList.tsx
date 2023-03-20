import { List } from '@mui/material';
import React, { FC } from 'react';

interface SideBarProps {
  children: React.ReactNode;
}

export const SideList: FC<SideBarProps> = ({ children }) => {
  return <List>{children}</List>;
};
