import { useFormikContext } from 'formik';
import { FC, useRef } from 'react';
import { SearchInvoiceDocument, useUpdateInvoiceItemMutation } from '@graphql/invoice/invoice';
import { useTimeout } from '../../../../hooks/useTimeOutHook';

interface FormObserverProps {
  invoiceId: string | undefined;
  row: any;
  name: string;
  searchInvoiceVariable: any;
}

interface FormValues {
  [id: string]: number | string;
}

export const FormObserver: FC<FormObserverProps> = ({ invoiceId, row, name, searchInvoiceVariable }) => {
  const { values } = useFormikContext<FormValues>();
  const valueRef = useRef(values);
  const [updateInvoiceItem] = useUpdateInvoiceItemMutation();

  useTimeout(
    () => {
      if (values[name] >= 0 || values[name] === '') {
        if (values[name] === valueRef.current[name]) return;

        const hours = values[name] === '' ? row[name] : (values[name] as number);
        const data = { [name]: hours, invoiceId: invoiceId as string, employeeId: row.id };

        updateInvoiceItem({
          variables: {
            invoiceItem: data
          },
          refetchQueries: [
            {
              query: SearchInvoiceDocument,
              variables: searchInvoiceVariable
            }
          ]
        });

        valueRef.current = values;
      }
    },
    1000,
    values
  );

  return null;
};
