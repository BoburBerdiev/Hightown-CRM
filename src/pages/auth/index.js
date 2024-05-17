import React from 'react';

const Signin = React.lazy(() => import('./Signin'));



export const authRouteConfig = [
  {
    path: '/signin',
    element: <Signin />,
  },
  // {
  //   path: '/signup',
  //   element: <Signup />,
  // },
  // {
  //   path: '/forget-password',
  //   element: <ForgotPassword />,
  // },
  // {
  //   path: '/confirm-signup',
  //   element: <ConfirmSignupAwsCognito />,
  // },
  // {
  //   path: '/reset-password',
  //   element: <ResetPasswordAwsCognito />,
  // },
];
