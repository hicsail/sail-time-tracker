import { WorkOff, WorkOutlined } from '@mui/icons-material';
import { FC } from 'react';
import { Box, Typography, CardContent, Card } from '@mui/material';

interface DisplayCardProps {
  id: string;
  title: string;
  hours: number;
}

export const DisplayCard: FC<DisplayCardProps> = ({ id, title, hours }) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        maxHeight: 90,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'customColors.cardBg'
      }}
    >
      <Box paddingLeft="1rem">{id === 'work' ? <WorkOutlined fontSize="large" /> : <WorkOff fontSize="large" />}</Box>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
        <Typography gutterBottom variant="subtitle2" component="div" color="customColors.cardTextTopColor">
          {title}
        </Typography>
        <Typography gutterBottom variant="h5" component="div" color="customColors.cardTextBottomColor">
          {hours}
        </Typography>
      </CardContent>
    </Card>
  );
};
