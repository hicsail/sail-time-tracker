import { FC, ReactNode } from 'react';
import { Stack, styled } from '@mui/material';

interface SplitScreenProps {
  children: ReactNode[];
  leftWeight: number;
  rightWeight: number;
  direction: 'row' | 'column';
}

const Pane = styled('div')(({ weight }: { weight: number }) => ({
  flex: weight
}));

export const SplitScreen: FC<SplitScreenProps> = ({ children, leftWeight = 1, rightWeight = 1, direction }) => {
  const [left, right] = children;

  return (
    <Stack direction={direction}>
      <Pane weight={leftWeight}>{left}</Pane>
      <Pane weight={rightWeight}>{right}</Pane>
    </Stack>
  );
};
