import { SvgIcon } from '@mui/material';
import { SVGIconProps } from '@components/icons/ClickupIcon';
import { FC } from 'react';

export const ThreeDotIcon: FC<SVGIconProps> = ({ fontSize, sx }) => {
  return (
    <SvgIcon fontSize={fontSize} sx={sx}>
      <svg viewBox="0 0 24 24">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {' '}
          <path d="M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12Z" fill="currentColor"></path>{' '}
          <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="currentColor"></path>{' '}
          <path d="M21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z" fill="currentColor"></path>{' '}
        </g>
      </svg>
    </SvgIcon>
  );
};
