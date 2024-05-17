import React from 'react';
import {Layout, message, Tag} from 'antd';
import './index.style.less';
import AppLogo from '../components/AppLogo';
import PropTypes from 'prop-types';
// import {FiMoreVertical} from 'react-icons/fi';
import {AiOutlineMenu} from 'react-icons/ai';
import {useQuery} from "react-query";
import apiService from "../../../services/apis/api";

const AppHeader = ({isCollapsed, onToggleSidebar}) => {
  const {Header} = Layout;


    const {
        data,
    } = useQuery('course-get-nav', () => apiService.getDataByID('/Kurs',1), {
        // enabled:false,
        onError: (error) => {
            message.error(error.message);
            // Handle the error
        },
    });

  // const menuMobile = (
  //   <Menu>
  //     <AppHeaderMessages />
  //     <AppNotifications />
  //     <AppLanguageSwitcher />
  //   </Menu>
  // );

  return (
    <Header className='app-header'>
      <a className='trigger' onClick={() => onToggleSidebar(!isCollapsed)}>
        <AiOutlineMenu />
      </a>
      <AppLogo />
      
      <div className='app-header-sectionDesktop'>
        {/* <AppLanguageSwitcher /> */}

          <Tag
                className={'course'}
              color={'#0014f6'}
          >{data?.price} $</Tag>
      </div>
      {/*<div className='app-header-section-mobile'>*/}
        {/* <Dropdown overlay={menuMobile} trigger={['click']}>
          <a className='ant-dropdown-link' onClick={(e) => e.preventDefault()}>
            <FiMoreVertical />
          </a>
        </Dropdown> */}
      {/*</div>*/}
    </Header>
  );
};

export default AppHeader;

AppHeader.propTypes = {
  onToggleSidebar: PropTypes.func,
  isCollapsed: PropTypes.bool,
};
