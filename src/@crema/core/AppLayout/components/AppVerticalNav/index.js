import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {Menu} from 'antd';
import {getRouteMenus} from '../../../../utility/VerticalMenuUtils';
import clsx from 'clsx';
import './index.style.less';
import defaultConfig from '../../../../utility/AppContextProvider/defaultConfig';
import {useSidebarContext} from '../../../../utility/AppContextProvider/SidebarContextProvider';
import {MenuStyle} from '../../../../../shared/constants/AppEnums';
import {useAuthUser} from "../../../../utility/AuthHooks";

const AppVerticalNav = () => {
  const {pathname} = useLocation();
  const selectedKeys = pathname.substring(1).split('/');
  const defaultOpenKeys = selectedKeys[0];
  const [openKeys, setOpenKeys] = useState([defaultOpenKeys]);
  const { user } = useAuthUser();
  const {menuStyle, sidebarColorSet} = useSidebarContext();


  useEffect(() => {
    setOpenKeys([selectedKeys[selectedKeys.length - 2]]);
  }, []);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  return (
    <Menu
      theme={sidebarColorSet.mode}
      mode='inline'
      className={clsx('app-main-sidebar-menu ', {
        // 'menu-rounded': menuStyle === MenuStyle.ROUNDED,
        // 'menu-rounded rounded-menu-reverse':
        //   menuStyle === MenuStyle.ROUNDED_REVERSE,
        'standard-menu': menuStyle === MenuStyle.STANDARD,
        // 'curved-menu': menuStyle === MenuStyle.CURVED_MENU,
        'bg-color-menu':
          sidebarColorSet.sidebarBgColor !==
          defaultConfig.sidebar.colorSet.sidebarBgColor,
      })}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      selectedKeys={[selectedKeys[selectedKeys.length - 1]]}>
      {getRouteMenus(selectedKeys,user)}
    </Menu>
  );
};

export default AppVerticalNav;
