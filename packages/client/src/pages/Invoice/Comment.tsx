import TextareaAutosize from '@mui/base/TextareaAutosize';
import { Button, Stack, styled, Typography, Divider } from '@mui/material';

export const Comments = () => {
  const StyledTextarea = styled(TextareaAutosize)(
    ({ theme }) => `
    width: 100%;
    height: 200px;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 10px;
    color: ${theme.palette.mode === 'dark' ? theme.palette.grey['300'] : theme.palette.grey['900']};
    background: ${theme.palette.mode === 'dark' ? theme.palette.grey['900'] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey['700'] : theme.palette.grey['100']};
    resize: none;
    
    &:hover {
      border-color: black;
    }
    
    &:focus {
      border-color: black;
      outline: 1.5px solid black;
    }
  `
  );

  return (
    <Stack direction="column">
      <Typography variant="h6" sx={{ marginBottom: 3 }}>
        Comments
      </Typography>
      <StyledTextarea minRows={5} />
      <Button variant="contained" sx={{ backgroundColor: 'black', marginTop: 5 }}>
        Post Comment
      </Button>
    </Stack>
  );
};
