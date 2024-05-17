import React from 'react';
import PropTypes from 'prop-types';
import {Card} from 'antd';
import AppAnimateGroup from '../../@crema/core/AppAnimateGroup';
import './AuthWrapper.style.less';
import {AppInfoView} from '../../@crema';
import AppLogo from '../../@crema/core/AppLayout/components/AppLogo';
import loginPage from '../../assets/login-page.jpg'


const AuthWrapper = ({children}) => {


  return (
    <AppAnimateGroup
      type='scale'
      animateStyle={{flex: 1}}
      delay={0}
      interval={10}
      duration={200}>
      <div className='auth-wrap' key={'wrap'}>
        <div className={'auth-wrap-bg-image'}>
          <img src={loginPage} alt={'loginbgBanner'} />

        </div>
        <Card className='auth-card'>
          <div className='auth-main-content'>
            <div className='auth-card-header'>
              <AppLogo/>
            </div>
            {children}
          </div>
          <div className='auth-wel-action'>
            <div className='auth-wel-content'>
              <img src={loginPage} alt="login-page"/>

            </div>
          </div>
        </Card>
      </div>
      <AppInfoView/>
    </AppAnimateGroup>
  );
};

export default AuthWrapper;

AuthWrapper.propTypes = {
  children: PropTypes.node,
};
