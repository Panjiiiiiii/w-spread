import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

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

export const SparkleIcon = ({ color = '#1F6F5F', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </Svg>
);

export const CrownIcon = ({ color = '#E8C75B', size = 12 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M2 19h20v2H2v-2zM2 5l5 7 5-7 5 7 5-7v11H2V5z" />
  </Svg>
);

export const DiamondIcon = ({ color = '#1F6F5F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 3h12l4 6-10 12L2 9z" />
    <Path d="M2 9h20" />
    <Path d="M10 3l-4 6 6 12 6-12-4-6" />
  </Svg>
);

export const ChevronRightIcon = ({ color = '#1F6F5F', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

export const CheckMarkSmallIcon = ({ color = '#1F6F5F', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

export const CreditCardIcon = ({ color = '#1F6F5F', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="1" y="4" width="22" height="16" rx="3" ry="3" />
    <Path d="M1 10h22" />
    <Path d="M5 15h4" />
  </Svg>
);

export const ShieldCheckIcon = ({ color = '#1F6F5F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M9 12l2 2 4-4" />
  </Svg>
);

export const TagIcon = ({ color = '#1F6F5F', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <Circle cx="7" cy="7" r="1.5" fill={color} />
  </Svg>
);

export const WalletIcon = ({ color = '#1F6F5F', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    <Path d="M16 21V5a2 2 0 0 0-2-2H4" />
    <Circle cx="17" cy="14" r="1.5" fill={color} />
  </Svg>
);

export const QrCodeIcon = ({ color = '#1F6F5F', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="3" width="7" height="7" rx="1" />
    <Rect x="14" y="3" width="7" height="7" rx="1" />
    <Rect x="3" y="14" width="7" height="7" rx="1" />
    <Path d="M14 14h3v3h-3z" />
    <Path d="M17 17h4v4h-4z" />
    <Path d="M14 20h3v1h-3z" />
    <Path d="M20 14h1v3h-1z" />
  </Svg>
);
