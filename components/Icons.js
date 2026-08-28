import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const DocumentFillIcon = ({ color = '#1F6F5F', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.66667 4.66667C4.66667 3.378 5.71134 2.33333 7 2.33333H16.5335C17.1523 2.33333 17.7458 2.57917 18.1834 3.01675L22.6499 7.48325C23.0875 7.92084 23.3333 8.51433 23.3333 9.13317V23.3333C23.3333 24.622 22.2887 25.6667 21 25.6667H7C5.71134 25.6667 4.66667 24.622 4.66667 23.3333V4.66667ZM9.33333 9.33333C8.689 9.33333 8.16667 9.85567 8.16667 10.5C8.16667 11.1443 8.689 11.6667 9.33333 11.6667H11.6667C12.311 11.6667 12.8333 11.1443 12.8333 10.5C12.8333 9.85567 12.311 9.33333 11.6667 9.33333H9.33333ZM8.16667 15.1667C8.16667 14.5223 8.689 14 9.33333 14H14C14.6443 14 15.1667 14.5223 15.1667 15.1667C15.1667 15.811 14.6443 16.3333 14 16.3333H9.33333C8.689 16.3333 8.16667 15.811 8.16667 15.1667ZM8.16667 19.8333C8.16667 19.189 8.689 18.6667 9.33333 18.6667H16.3333C16.9777 18.6667 17.5 19.189 17.5 19.8333C17.5 20.4777 16.9777 21 16.3333 21H9.33333C8.689 21 8.16667 20.4777 8.16667 19.8333Z"
      fill={color}
    />
  </Svg>
);

export const DocumentOutlineIcon = ({ color = '#1F6F5F', size = 36 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Path d="M14 2v6h6" />
    <Path d="M16 13H8" />
    <Path d="M16 17H8" />
    <Path d="M10 9H8" />
  </Svg>
);

export const ArrowLeftIcon = ({ color = '#FFFFFF', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5" />
    <Path d="M12 19l-7-7 7-7" />
  </Svg>
);

export const CheckCircleIcon = ({ color = '#27AE60', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" />
  </Svg>
);
