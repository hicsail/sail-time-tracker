import { StyledPaper } from '@components/StyledPaper';
import { PaperProps, TableContainer } from '@mui/material';
import { FC } from 'react';

interface CustomTableContainerProps extends PaperProps {
  children: React.ReactNode;
  sx?: any;
}

export const CustomTableContainer: FC<CustomTableContainerProps> = ({ children, sx, ...otherProps }) => {
  return (
    <TableContainer
      component={StyledPaper}
      elevation={0}
      sx={{
        boxShadow: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px'
            : 'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px;',
        ...sx
      }}
      {...otherProps}
    >
      {children}
    </TableContainer>
  );
};
