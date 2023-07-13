import { FC, ReactNode } from 'react';
import { Box, Typography, CardContent, Card, styled } from '@mui/material';

interface DisplayCardProps {
  id: string;
  title: string;
  data: number | undefined | string | ReactNode;
  icon?: ReactNode;
}

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  maxHeight: 90,
  display: 'flex',
  flexDirection: 'row',
  paddingRight: 2,
  alignItems: 'center',
  backgroundColor: theme.palette.mode === 'light' ? 'white' : theme.palette.grey['800'],
  boxShadow:
    theme.palette.mode === 'light'
      ? 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px'
      : 'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px'
}));

export const DisplayCard: FC<DisplayCardProps> = ({ id, title, data, icon }) => {
  return (
    <StyledCard key={id}>
      {icon && <Box paddingLeft="1rem">{icon}</Box>}
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
        <Typography gutterBottom variant="subtitle2" component="div" color="customColors.cardTextTopColor">
          {title}
        </Typography>
        <Typography gutterBottom variant="h5" component="div" color="customColors.cardTextBottomColor">
          {data}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};
