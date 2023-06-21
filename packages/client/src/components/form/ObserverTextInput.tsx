import { FormControl, TextField, TextFieldProps } from '@mui/material';
import { FC } from 'react';
import { useFormikContext } from 'formik';

export type TextInputProps = TextFieldProps & {
  name: string;
};

export const ObserverTextInput: FC<TextInputProps> = (props) => {
  const { handleChange, handleBlur, values, touched, errors, isSubmitting } = useFormikContext<any>();

  return (
    <FormControl variant={props.variant} fullWidth={props.fullWidth}>
      <TextField
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[props.name]}
        disabled={props.disabled || isSubmitting}
        error={!!errors[props.name]}
        helperText={(touched[props.name] && errors[props.name]) as string}
      />
    </FormControl>
  );
};
