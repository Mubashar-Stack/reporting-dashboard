// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/customerDashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Stats',
    path: '/customerDashboard/stats',
    icon: getIcon('ant-design:line-chart-outlined'),
  },
  {
    title: 'Profile',
    path: '/customerDashboard/profile',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Domains',
    path: '/customerDashboard/customerDomains',
    icon: getIcon('eva:shield-fill'),
  },
];

export default navConfig;
