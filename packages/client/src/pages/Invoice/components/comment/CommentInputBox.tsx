import { StyledTextarea } from '@components/StyledComponent';
import { Button, Stack, Typography } from '@mui/material';
import { FC, useRef } from 'react';

interface CommentsProps {
  onSubmit: (value: string | undefined) => void;
}

export const CommentInputBox: FC<CommentsProps> = ({ onSubmit }) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <Stack direction="column">
      <Typography variant="h6" sx={{ marginBottom: 3 }}>
        Comments
      </Typography>
      <StyledTextarea minRows={5} ref={inputRef} />
      <Button
        variant="contained"
        sx={{ backgroundColor: 'black', marginTop: 5 }}
        onClick={() => {
          onSubmit(inputRef.current?.value);
          inputRef.current!.value = '';
        }}
      >
        Post Comment
      </Button>
    </Stack>
  );
};
