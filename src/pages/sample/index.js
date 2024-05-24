import React from 'react';
import {RoutePermittedRole} from '../../shared/constants/AppEnums';

const Dashboard = React.lazy(() => import('./Dashboard'));
const PDF = React.lazy(() => import('./PDF'));
const Selling = React.lazy(() => import('./Selling'));
const Slot = React.lazy(() => import('./Slot'));
const SlotPostEdit = React.lazy(() => import('./Slot/SlotPostEdit'));
const House = React.lazy(() => import('./House'));
const HousePostEdit = React.lazy(() => import('./House/HousePostEdit'));
const Floor = React.lazy(() => import('./Floor'));
const FloorPostEdit = React.lazy(() => import('./Floor/FloorPostEdit'));
const Payment = React.lazy(() => import('./Payment Method'));
const PaymentPostEdit = React.lazy(() => import('./Payment Method/PaymentPostEdit'));
const User = React.lazy(() => import('./User'));
const UserPostEdit = React.lazy(() => import('./User/UserPostEdit'));
const Course = React.lazy(() => import('./Course'));
const Apartment = React.lazy(() => import('./Apartment'));
const ApartmentPostEdit = React.lazy(() => import('./Apartment/ApartmentPostEdit'));


export const samplePagesConfigs = [
  {
    permittedRole: RoutePermittedRole.user,
    path: '/dashboard',
    element: <Dashboard/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/pdf',
    element: <PDF/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/selling',
    element: <Selling/>,
  },
  {
    permittedRole: RoutePermittedRole.admin,
    path: '/slot',
    element: <Slot/>,
  },
  {
    permittedRole: RoutePermittedRole.admin,
    path: '/slot/add',
    element: <SlotPostEdit/>,
  },
  {
    permittedRole: RoutePermittedRole.admin,
    path: '/house',
    element: <House/>,
  },
  {
    permittedRole: RoutePermittedRole.admin,
    path: '/house/add',
    element: <HousePostEdit/>,
  },
  {
    permittedRole: RoutePermittedRole.admin,
    path: '/floor',
    element: <Floor/>,
  },
  {
    permittedRole: RoutePermittedRole.admin,
    path: '/floor/add',
    element: <FloorPostEdit/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/payment',
    element: <Payment/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/payment/add',
    element: <PaymentPostEdit/>,
  },
  {
    permittedRole: RoutePermittedRole.admin,
    path: '/user',
    element: <User/>,
  },
  {
    permittedRole: RoutePermittedRole.admin,
    path: '/user/add',
    element: <UserPostEdit/>,
  },
  {
    permittedRole: RoutePermittedRole.admin,
    path: '/course',
    element: <Course/>,
  },
  {
    permittedRole: RoutePermittedRole.admin,
    path: '/apartment',
    element: <Apartment/>,
  },
  {
    permittedRole: RoutePermittedRole.admin,
    path: '/apartment/add',
    element: <ApartmentPostEdit/>,
  },
];
