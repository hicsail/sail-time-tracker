import { useFormikContext } from 'formik';
import { FC, useEffect, useRef } from 'react';

interface FormObserverProps {}

interface FormValues {
  [id: string]: number | string;
}

export const FormObserver: FC<FormObserverProps> = ({}) => {
  const { values } = useFormikContext<FormValues>();
  const valueRef = useRef(values);

  useEffect(() => {
    console.log(values);
  }, [values]);

  return null;
};
