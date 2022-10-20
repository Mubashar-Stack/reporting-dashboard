
import { faker } from '@faker-js/faker';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { sentenceCase } from 'change-case';

import {
  Card,
  CardHeader,
  Grid,
  Container,
  Typography,
  Box,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Input,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
} from '@mui/material';

import dayjs from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import { AppWidgetSummary, UserListHead, UserListToolbar, UserMoreMenu} from '../sections/@dashboard/app';
// import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/app';

import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';

// ----------------------------------------------------------------------
import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------


export default function DashboardApp() {
   
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const [showdomain, setShowDomain] = useState(false);
  const [fromdate, setFromDate] = useState(dayjs('2022-04-07'));

  const [todate, setToDate] = useState(dayjs('2022-04-07'));
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = USERLIST.map((n) => n.name);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  // const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = USERLIST.length === 0;
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 10,
  };

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3} lg={2.2}>
            <AppWidgetSummary title="Impressions" total={714000} icon={'ant-design:facebook-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2.2}>
            <AppWidgetSummary title="eCPM" total={1352831} color="info" icon={'ant-design:monitor-outlined'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2.2}>
            <AppWidgetSummary
              title="Estimated Revenue"
              total={1723315}
              color="warning"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2.2}>
            <AppWidgetSummary title="This Month Revenue" total={234} color="info" icon={'ant-design:rise-outlined'} />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.2}>
            <AppWidgetSummary
              title="Last Month Revenue"
              total={234}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={12} container spacing={3} justifyContent="space-between">
            <Grid item xs={12} md={4} lg={4}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Domain" defaultValue={5}>
                    <MenuItem value={5}>Select Domain</MenuItem>
                    <MenuItem value={10}>www.xyz.com</MenuItem>
                    <MenuItem value={20}>www.abc.xom</MenuItem>
                    <MenuItem value={30}>www.123.com</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Domain" defaultValue={5}>
                    <MenuItem value={5}>Select Time Period</MenuItem>
                    <MenuItem value={10}>Daily</MenuItem>
                    <MenuItem value={20}>Weekly</MenuItem>
                    <MenuItem value={30}>Montly</MenuItem>
                    <MenuItem
                      value={360}
                      onClick={() => {
                        setShow(true);
                      }}
                    >
                      Cutome Range
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          {show && (
            <Grid item xs={12} md={6} lg={8} container spacing={3} justifyContent="start" style={{ margin: '6px' }}>
              <Grid item xs={12} md={6} lg={8} container spacing={3} justifyContent="space-between">
               
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="From Date"
                    value={fromdate}
                    onChange={(newValue) => {
                      setFromDate(newValue);
                    }}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="To Dat Date"
                    value={todate}
                    onChange={(newValue) => {
                      setToDate(newValue);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Card style={{marginTop:50}}>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  // onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {USERLIST.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, role, status, company, avatarUrl, isVerified } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2} style={{marginLeft:10}}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{company}</TableCell>
                        <TableCell align="left">{role}</TableCell>
                        <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>
                        <TableCell align="left">
                          <Label variant="ghost" color={(status === 'banned' && 'error') || 'success'}>
                            {sentenceCase(status)}
                          </Label>
                        </TableCell>

                        <TableCell align="right">
                          <UserMoreMenu />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
