import { useState } from 'react';
import DatePicker from 'react-datepicker';
import styled, { createGlobalStyle } from 'styled-components';

export const DateRangePickerComponent = () => {
  const [dateRange, setDateRange] = useState<(Date | null)[]>([null, null]);
  const [startDate, endDate] = dateRange;
  const DatePickerWrapperStyles = styled.div`
    input {
      outline: none;
      border: 1px solid darkgrey;
      border-radius: 4px;
      width: 250px;
      padding: 1rem 1rem;
      height: 60px;
      font-size: 1rem;
      background-color: rgb(242, 242, 242);
    }

    button::after {
      width: 2em;
      height: 2em;
      background-color: rgb(110, 110, 110);
    }

    .react-datepicker__day--in-range {
      background-color: rgba(0, 114, 229, 0.27);
      color: black;
      opacity: 0.7;
    }

    .react-datepicker__day--keyboard-selected,
    .react-datepicker__day--range-start,
    .react-datepicker__day--range-end {
      background-color: #0072e5;
      color: white;
      opacity: 1;
    }

    .react-datepicker__day--in-selecting-range {
      background-color: rgba(0, 114, 229, 0.27);
      color: black;
      opacity: 0.7;
    }

    .react-datepicker__day--selecting-range-start,
    .react-datepicker__day--selecting-range-end {
      background-color: #0072e5;
      color: white;
      opacity: 1;
    }

    .react-datepicker {
      border: none;
      box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      background-color: #fff;
      color: rgba(0, 0, 0, 0.87);
    }

    .react-datepicker__current-month {
      margin-top: 16px;
      margin-bottom: 8px;
      padding-left: 24px;
      padding-right: 12px;
      max-height: 30px;
      min-height: 30px;
    }

    .react-datepicker__navigation {
      top: 22px;
    }

    .react-datepicker__navigation--previous {
      left: 20px;
    }

    .react-datepicker__navigation--next {
      right: 20px;
    }

    .react-datepicker__header {
      background-color: white;
    }

    .react-datepicker__day-name {
      color: rgba(0, 0, 0, 0.6);
      font-weight: 400;
      font-size: 0.75rem;
      line-height: 1.66;
      width: 36px;
      height: 40px;
      margin: 0 2px;
    }

    .react-datepicker__week {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .react-datepicker__day {
      font-weight: 400;
      font-size: 0.75rem;
      line-height: 1.66;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      padding: 0;
      margin: 0 2px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .react-datepicker__month-container {
      width: 320px;
      max-height: 358px;
      margin: 0 auto;
      padding-bottom: 2rem;
    }
  `;

  return (
    <>
      <DatePickerWrapperStyles>
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
          isClearable={true}
          wrapperClassName="date_picker full-width"
          calendarStartDay={1}
        />
      </DatePickerWrapperStyles>
    </>
  );
};
