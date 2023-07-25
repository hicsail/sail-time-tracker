import { Box, Button, Stack, Typography, Link } from '@mui/material';
import { Paths } from '@constants/paths';

const getImageUrl = (name: string) => {
  return new URL(`/public/${name}.svg`, import.meta.url).href;
};

export const NotFoundAdmin = ({ page }: { page?: string }) => {
  return (
    <Stack justifyContent="center" sx={{ maxWidth: 1800, margin: 'auto' }}>
      <Box component="img" sx={{ textAlign: 'center' }} alt="The house from the offer." src={getImageUrl('not_found')} />
      <Stack sx={{ textAlign: 'center' }} justifyContent="center" alignItems="center" gap={3}>
        <Typography variant="h1" sx={{ color: '#6783CD' }}>
          No Results Found
        </Typography>
        <Typography>Sorry the page you're looking for doesn't exits or have been removed.</Typography>
        {page !== 'admin' && (
          <Button variant="contained" sx={{ width: 300, height: 50 }}>
            <Link href={Paths.TRACK} underline="none" sx={{ color: 'white' }}>
              Go Back Home
            </Link>
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
