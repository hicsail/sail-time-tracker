import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import InfoIcon from '@mui/icons-material/Info';
import { Box } from '@mui/material';

interface BannerProps {
  content: string;
  state: 'success' | 'error' | 'info';
}

export const Banner: FC<BannerProps> = ({ content, state }) => {
  const contentRender = () => {
    switch (state) {
      case 'success':
        return <CheckCircleOutlineIcon color="success" fontSize="large" />;
      case 'error':
        return <ReportGmailerrorredIcon color="error" fontSize="large" />;
      case 'info':
        return <InfoIcon color="info" fontSize="large" />;
      default:
        return <InfoIcon color="info" fontSize="large" />;
    }
  };

  const messageRender = () => {
    switch (state) {
      case 'success':
        return 'Success!';
      case 'error':
        return 'Something Went Wrong!';
      case 'info':
        return 'Info!';
      default:
        return <InfoIcon color="info" fontSize="large" />;
    }
  };

  const colorRender = () => {
    switch (state) {
      case 'success':
        return 'success.dark';
      case 'error':
        return 'error.dark';
      case 'info':
        return 'info.dark';
      default:
        return 'info.dark';
    }
  };

  return (
    <Card sx={{ position: 'fixed', top: '8%', right: '35%', transform: 'translate(-50%,-50%)', width: 'auto', minWidth: '300px', padding: '3px 10px', zIndex: 10 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <CardContent>{contentRender()}</CardContent>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="subtitle1" sx={{ fontWeight: 'bold', color: `${colorRender()}` }}>
            {messageRender()}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {content}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};
