import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { WorkSuitIcon } from '@pages/Track/components/images/WorkSuitIcon';
import { RestIcon } from '@pages/Track/components/images/RestIcon';
import { FC } from 'react';
import Box from '@mui/material/Box';

interface DisplayCardProps {
  id: string;
  title: string;
  hours: string;
}

export const DisplayCard: FC<DisplayCardProps> = ({ id, title, hours }) => {
  return (
    <Card sx={{ maxWidth: 345, maxHeight: 90, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Box paddingLeft="1rem">{id === 'work' ? <WorkSuitIcon width={50} height={50} /> : <RestIcon width={50} height={50} />}</Box>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
        <Typography gutterBottom variant="subtitle2" component="div" color="#616161">
          {title}
        </Typography>
        <Typography gutterBottom variant="h5" component="div" color="#212121">
          {hours}
        </Typography>
      </CardContent>
    </Card>
  );
};
