import { ReactNode } from 'react';
import { Stack, styled } from '@mui/material';

interface SplitScreenProps {
  children: ReactNode[];
  leftWeight: number;
  rightWeight: number;
  direction: 'row' | 'column';
}

const Pane = styled('div')<PaneProps>(({ weight }) => ({
  flex: weight
}));

interface PaneProps {
  weight: number;
}

export const SplitScreen = ({ children, leftWeight = 1, rightWeight = 1, direction }: SplitScreenProps) => {
  const [left, right] = children;

  return (
    <Stack direction={direction}>
      <Pane weight={leftWeight}>{left}</Pane>
      <Pane weight={rightWeight}>{right}</Pane>
    </Stack>
  );
};
