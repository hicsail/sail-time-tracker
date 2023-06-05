import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { Box } from '@mui/material';

interface BannerProps {
  content: string;
  state: 'success' | 'error';
}

export const Banner: FC<BannerProps> = ({ content, state }) => {
  return (
    <Card sx={{ position: 'fixed', top: '10%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <CardContent>{state === 'success' ? <CheckCircleOutlineIcon color="success" fontSize="large" /> : <ReportGmailerrorredIcon color="error" fontSize="large" />}</CardContent>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="subtitle1" sx={{ fontWeight: 'bold', color: `${state === 'success' ? 'success.dark' : 'error.dark'}` }}>
            {state === 'success' ? 'Success!' : 'Something Went Wrong!'}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {content}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};
