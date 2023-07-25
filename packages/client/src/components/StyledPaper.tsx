import { Paper, PaperProps, styled } from '@mui/material';
import { FC, ReactNode } from 'react';

const NewPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? 'white' : theme.palette.grey['800'],
  width: '100%',
  mb: 2,
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column'
}));

interface StyledPaperProps extends PaperProps {
  children: ReactNode[] | ReactNode;
}
export const StyledPaper: FC<StyledPaperProps> = ({ children, ...otherOptions }) => {
  return <NewPaper {...otherOptions}>{children}</NewPaper>;
};
