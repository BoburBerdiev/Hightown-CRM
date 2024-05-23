import React from 'react';
import {Layout} from 'antd';
import {ThemeMode} from '../../../../shared/constants/AppEnums';
import {useThemeContext} from '../../../utility/AppContextProvider/ThemeContextProvider';
import {useSidebarContext} from '../../../utility/AppContextProvider/SidebarContextProvider';
import PropTypes from 'prop-types';
import sideBarImage from '../../../../assets/1.png'
const {Sider} = Layout;

const MainSidebar = ({children, className, collapsed = false, ...props}) => {
  const {themeMode} = useThemeContext();
  const {sidebarColorSet, isSidebarBgImage} =
    useSidebarContext();

  return (
    <Sider
      theme={themeMode === ThemeMode.LIGHT ? ThemeMode.LIGHT : ThemeMode.DARK}
      breakpoint='lg'
      className={className}
      style={{
        backgroundColor: sidebarColorSet.sidebarBgColor,
        color: sidebarColorSet.sidebarTextColor,
        backgroundImage: isSidebarBgImage
          ? `url(${sideBarImage})`
          : '',
      }}
      collapsed={collapsed}
      {...props}>
      {children}
    </Sider>
  );
};

export default MainSidebar;
MainSidebar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.any,
  collapsed: PropTypes.bool,
};
