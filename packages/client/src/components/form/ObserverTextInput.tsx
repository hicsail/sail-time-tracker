import { FormControl, TextFieldProps } from '@mui/material';
import { FC } from 'react';
import { useFormikContext } from 'formik';
import { DefaultTextInput } from '@components/StyledComponent';

export type TextInputProps = TextFieldProps & {
  name: string;
};

export const ObserverTextInput: FC<TextInputProps> = (props) => {
  const { handleChange, handleBlur, values, touched, errors, isSubmitting } = useFormikContext<any>();

  return (
    <FormControl variant={props.variant} fullWidth={props.fullWidth}>
      <DefaultTextInput
        {...props}
        onWheel={(e) => {
          e.currentTarget.blur();
          e.stopPropagation();
        }}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[props.name]}
        disabled={props.disabled || isSubmitting}
        error={!!errors[props.name]}
        helperText={(touched[props.name] && errors[props.name]) as string}
        sx={{
          '.MuiFormHelperText-root ': { width: '120px', marginRight: 0 },
          ...props.sx
        }}
      />
    </FormControl>
  );
};
