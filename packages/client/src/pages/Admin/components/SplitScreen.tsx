import { FC, ReactNode } from 'react';
import { Box, styled } from '@mui/material';

interface SplitScreenProps {
  children: ReactNode[];
  leftWeight: number;
  rightWeight: number;
}

const Pane = styled('div')(({ weight }: { weight: number }) => ({
  flex: weight
}));

export const SplitScreen: FC<SplitScreenProps> = ({ children, leftWeight = 1, rightWeight = 1 }) => {
  const [left, right] = children;

  return (
    <Box sx={{ display: 'flex' }}>
      <Pane weight={leftWeight}>{left}</Pane>
      <Pane weight={rightWeight}>{right}</Pane>
    </Box>
  );
};
