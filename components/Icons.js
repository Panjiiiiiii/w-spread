import React from 'react';
import Svg, { Path, Rect, Circle, G } from 'react-native-svg';

export const DocumentFillIcon = ({ color = '#1F6F5F', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.66667 4.66667C4.66667 3.378 5.71134 2.33333 7 2.33333H16.5335C17.1523 2.33333 17.7458 2.57917 18.1834 3.01675L22.6499 7.48325C23.0875 7.92084 23.3333 8.51433 23.3333 9.13317V23.3333C23.3333 24.622 22.2887 25.6667 21 25.6667H7C5.71134 25.6667 4.66667 24.622 4.66667 23.3333V4.66667ZM9.33333 9.33333C8.689 9.33333 8.16667 10.85567 8.16667 10.5C8.16667 11.1443 8.689 11.6667 9.33333 11.6667H11.6667C12.311 11.6667 12.8333 11.1443 12.8333 10.5C12.8333 9.85567 12.311 9.33333 11.6667 9.33333H9.33333ZM8.16667 15.1667C8.16667 14.5223 8.689 14 9.33333 14H14C14.6443 14 15.1667 14.5223 15.1667 15.1667C15.1667 15.811 14.6443 16.3333 14 16.3333H9.33333C8.689 16.3333 8.16667 15.811 8.16667 15.1667ZM8.16667 19.8333C8.16667 19.189 8.689 18.6667 9.33333 18.6667H16.3333C16.9777 18.6667 17.5 19.189 17.5 19.8333C17.5 20.4777 16.9777 21 16.3333 21H9.33333C8.689 21 8.16667 20.4777 8.16667 19.8333Z"
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

export const GoogleIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </Svg>
);

export const MailIcon = ({ color = '#1F6F5F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Path d="M22 6l-10 7L2 6" />
  </Svg>
);

export const LockIcon = ({ color = '#1F6F5F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

export const UserIcon = ({ color = '#1F6F5F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

export const EyeIcon = ({ color = '#828282', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Circle cx="12" cy="12" r="3" />
  </Svg>
);

export const EyeOffIcon = ({ color = '#828282', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <Path d="M1 1l22 22" />
  </Svg>
);

export const LogOutIcon = ({ color = '#EB5757', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Path d="M16 17l5-5-5-5" />
    <Path d="M21 12H9" />
  </Svg>
);

export const HistoryIcon = ({ color = '#1F6F5F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <Path d="M3 3v5h5" />
    <Path d="M12 7v5l4 2" />
  </Svg>
);

export const TrendingUpIcon = ({ color = '#1F6F5F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 6l-9.5 9.5-5-5L1 18" />
    <Path d="M17 6h6v6" />
  </Svg>
);

export const BarChartIcon = ({ color = '#1F6F5F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 20V10" />
    <Path d="M12 20V4" />
    <Path d="M6 20v-6" />
  </Svg>
);

export const CalendarIcon = ({ color = '#828282', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Path d="M16 2v4" />
    <Path d="M8 2v4" />
    <Path d="M3 10h18" />
  </Svg>
);

export const TrashIcon = ({ color = '#EB5757', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 6h18" />
    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <Path d="M10 11v6" />
    <Path d="M14 11v6" />
  </Svg>
);

export const SlidersIcon = ({ color = '#1F6F5F', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 21v-7" />
    <Path d="M4 10V3" />
    <Path d="M12 21v-9" />
    <Path d="M12 8V3" />
    <Path d="M20 21v-5" />
    <Path d="M20 12V3" />
    <Path d="M1 14h6" />
    <Path d="M9 8h6" />
    <Path d="M17 16h6" />
  </Svg>
);

