import React from 'react';
import './index.style.less';
import AuthWrapper from '../AuthWrapper';
import AppPageMetadata from '../../../@crema/core/AppPageMetadata';
import SigninJwtAuth from "../Signin/SigninJwtAuth";

const Signup = () => {
  return (
    <AuthWrapper>
      <AppPageMetadata title='Register' />
     <SigninJwtAuth/>
    </AuthWrapper>
  );
};

export default Signup;
