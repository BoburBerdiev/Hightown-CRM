import {Link, useLocation} from 'react-router-dom';
import {Menu} from 'antd';
import React, {Fragment} from 'react';
import routesConfig from '../../pages/routeConfig';
import {useIntl} from 'react-intl';
import {useSidebarContext} from './AppContextProvider/SidebarContextProvider';

function getStyles(item, sidebarColorSet, isSidebarBgImage, index, isGroup) {
  const {pathname} = useLocation();
  const selectedKeys = pathname.substring(1);
  const defaultOpenKeys = selectedKeys.split('/');

  if (index === 0 || isGroup) {
    return {
      color: sidebarColorSet.sidebarTextColor,
      backgroundColor: isSidebarBgImage ? '' : sidebarColorSet.sidebarBgColor,
    };
  } else {
    const isActive = defaultOpenKeys[0] === item.id;


    return {
      color: isActive
        ? sidebarColorSet.sidebarMenuSelectedTextColor
        : sidebarColorSet.sidebarTextColor,
      backgroundColor: isActive
        ? sidebarColorSet.sidebarMenuSelectedBgColor
        : isSidebarBgImage
        ? ''
        : sidebarColorSet.sidebarBgColor,


    };
  }
}

const renderMenuItemChildren = (item) => {
  const {icon, messageId, path} = item;
  const {messages} = useIntl();

  if (path && path.includes('/'))
    return (
      <Link to={path} >
        {icon &&
          (React.isValidElement(icon) ? (
            <span className='ant-menu-item-icon'>{icon}</span>
          ) : (
            <icon className='ant-menu-item-icon' />
          ))}
        <span data-testid={messageId.toLowerCase + '-nav'}>
          {messages[messageId]}
        </span>
      </Link>
    );
  else {
    return (
      <>
        {icon &&
          (React.isValidElement(icon) ? (
            <span className='ant-menu-item-icon'>{icon}</span>
          ) : (
            <icon className='ant-menu-item-icon' />
          ))}
        <span data-testid={messageId.toLowerCase + '-nav'}>
          {messages[messageId]}
        </span>
      </>
    );
  }
};


const renderMenuItem = (item, sidebarColorSet, isSidebarBgImage, index,user) => {
  const isAllowed = !user?.role[1]&& item?.role === user?.role;
  if (!isAllowed && !user?.role[1]) {
    return null; // or any other appropriate action if not allowed
  }

  return (
      <Fragment key={item.id}>
        {item.type === 'collapse' ? (
            <Menu.SubMenu
                style={getStyles(item, sidebarColorSet, isSidebarBgImage, index, true)}
                key={item.path || item.id}
                title={renderMenuItemChildren(item, sidebarColorSet, isSidebarBgImage)}
            >
              {item.children.map((childItem) =>
                  renderMenuItem(childItem, sidebarColorSet, isSidebarBgImage, index + 1)
              )}
            </Menu.SubMenu>
        ) : (
            <Menu.Item
                key={item.id}
                style={getStyles(item, sidebarColorSet, isSidebarBgImage, index)}
            >
              {item.children ? item.children : renderMenuItemChildren(item, sidebarColorSet, isSidebarBgImage)}
            </Menu.Item>
        )}
      </Fragment>
  );
};

const renderMenu = (item, sidebarColorSet, isSidebarBgImage, index,user) => {
  return item.type === 'group' ? (
    <Menu.ItemGroup

      style={getStyles(item, sidebarColorSet, isSidebarBgImage, index, true)}
      key={item.path ? item.path : item.id}
      title={renderMenuItemChildren(item, sidebarColorSet, isSidebarBgImage)}>
      {item.children.map((item) =>
        renderMenuItem(item, sidebarColorSet, isSidebarBgImage, index + 1,user),
      )}
    </Menu.ItemGroup>
  ) : (
    <Menu.Item

      key={item.id}
      exact={item.exact}
      style={getStyles(item, sidebarColorSet, isSidebarBgImage, index)}>
      {item.children
        ? item.children
        : renderMenuItemChildren(
            item,
            sidebarColorSet,
            isSidebarBgImage,
            index,
          )}
    </Menu.Item>
  );
};

export const getRouteMenus = (_,user) => {
  const {sidebarColorSet} = useSidebarContext();
  const {isSidebarBgImage} = useSidebarContext();
  return routesConfig.map((route) =>
    renderMenu(route, sidebarColorSet, isSidebarBgImage, 0,user),
  );
};
