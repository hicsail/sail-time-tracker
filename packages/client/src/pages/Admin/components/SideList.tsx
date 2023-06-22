import { List } from '@mui/material';
import { FC, ReactNode } from 'react';

interface SideBarProps {
  children: ReactNode;
}

export const SideList: FC<SideBarProps> = ({ children }) => {
  return <List>{children}</List>;
};
