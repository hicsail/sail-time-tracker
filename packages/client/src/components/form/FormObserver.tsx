import { useFormikContext } from 'formik';
import { FC, useEffect, useRef } from 'react';

interface FormObserverProps {
  id: string;
  handleOnChange: (value: number) => void;
}

interface FormValues {
  [id: string]: number | string;
}

export const FormObserver: FC<FormObserverProps> = ({ id, handleOnChange }) => {
  const { values } = useFormikContext<FormValues>();
  const valueRef = useRef(values);

  useEffect(() => {
    if (values[id] === valueRef.current[id] || values[id] < 0) return;
    const timeId = setTimeout(() => {
      const value = values[id] === 0 || values[id] === '' ? 0 : (values[id] as number);
      handleOnChange(value);
    }, 1000);
    valueRef.current = values;

    return () => clearTimeout(timeId);
  }, [values]);

  return null;
};
