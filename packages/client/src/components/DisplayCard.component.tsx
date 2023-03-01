import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { WorkSuitIcon } from '@components/images/WorkSuitIcon';
import { RestIcon } from '@components/images/RestIcon';

type DisplayCardProps = {
  item: {
    title: string;
    id: string;
    hours: string;
  };
};

export const DisplayCard = ({ item }: DisplayCardProps) => {
  return (
    <Card sx={{ maxWidth: 345, maxHeight: 90, display: 'flex', flexDirection: 'row', alignItems: 'start' }}>
      <CardContent>{item.id === 'work' ? <WorkSuitIcon width={50} height={50} /> : <RestIcon width={50} height={50} />}</CardContent>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
        <Typography gutterBottom variant="subtitle2" component="div" color="#616161">
          {item.title}
        </Typography>
        <Typography gutterBottom variant="h5" component="div" color="#212121">
          {item.hours}
        </Typography>
      </CardContent>
    </Card>
  );
};
