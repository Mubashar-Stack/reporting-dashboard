// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Stats',
    path: '/dashboard/stats',
    icon: getIcon('ant-design:line-chart-outlined'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Upload Reports',
    path: '/dashboard/uploadReports',
    icon: getIcon('eva:upload-fill'),
  },
  {
    title: 'Domains',
    path: '/dashboard/domains',
    icon: getIcon('eva:shield-fill'),
  },
  {
    title: 'Users Domains',
    path: '/dashboard/usersDomains',
    icon: getIcon('eva:award-fill'),
  },
];

export default navConfig;
