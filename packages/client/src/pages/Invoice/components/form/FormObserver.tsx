import { useFormikContext } from 'formik';
import { FC, useRef } from 'react';
import { SearchInvoiceDocument, useUpdateInvoiceItemMutation } from '@graphql/invoice/invoice';
import { useTimeout } from '../../../../hooks/useTimeOutHook';

interface FormObserverProps {
  invoiceId: string | undefined;
  row: any;
  name: string;
  searchInvoiceVariable: any;
  handleOnSubmitComment: (value: string) => void;
}

interface FormValues {
  [id: string]: number | string;
}

export const FormObserver: FC<FormObserverProps> = ({ invoiceId, row, name, searchInvoiceVariable, handleOnSubmitComment }) => {
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
        }).then((res) => {
          if (res.data) {
            const content = `Changed ${row.employeeName}'s ${name} from ${row[name]} to ${hours}`;
            handleOnSubmitComment(content);
          }
        });

        valueRef.current = values;
      }
    },
    1000,
    values
  );

  return null;
};
