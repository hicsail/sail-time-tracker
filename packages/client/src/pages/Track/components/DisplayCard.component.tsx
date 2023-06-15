import { FC, ReactNode } from 'react';
import { Box, Typography, CardContent, Card } from '@mui/material';

interface DisplayCardProps {
  id: string;
  title: string;
  data: number | undefined | string;
  icon?: ReactNode;
}

export const DisplayCard: FC<DisplayCardProps> = ({ id, title, data, icon }) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        maxHeight: 90,
        display: 'flex',
        flexDirection: 'row',
        paddingRight: 2,
        alignItems: 'center',
        backgroundColor: 'customColors.cardBg'
      }}
    >
      <Box paddingLeft="1rem">{icon}</Box>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
        <Typography gutterBottom variant="subtitle2" component="div" color="customColors.cardTextTopColor">
          {title}
        </Typography>
        <Typography gutterBottom variant="h5" component="div" color="customColors.cardTextBottomColor">
          {data}
        </Typography>
      </CardContent>
    </Card>
  );
};
