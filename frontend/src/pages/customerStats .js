/* eslint-disable */
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { fShortenNumber } from '../utils/formatNumber';
import { format } from 'date-fns';
// material
import { styled } from '@mui/material/styles';
import axios from 'axios';
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

import Modal from '@mui/material/Modal';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/domains';
import { AppWidgetSummary } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Domain_name', label: 'Domain Name', alignRight: false },
  { id: 'eCPM', label: 'eCPM', alignRight: false },
  { id: 'Calculated_Ad_Requests', label: 'Ad Requests', alignRight: false },
  { id: 'Calculated_Ad_Impressions', label: 'Ad Impressions', alignRight: false },
  { id: 'Calculated_Revenue', label: 'Revenue', alignRight: false },

];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.Domain_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const now = new Date();
  const [show, setShow] = useState(false);
  const [showdomain, setShowDomain] = useState(false);
  const [fromdate, setFromDate] = useState(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString().slice(0, 19).replace('T', ' ')
  );

  const [todate, setToDate] = useState(new Date().toISOString().slice(0, 19).replace('T', ' '));
  const [domainSelected, setDomainSelected] = useState('');

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [allDomainList, setAllDomainList] = useState([]);
  const [filterData, setFilterData] = useState(null);
  const [filterTableData, setFilterTableData] = useState([]);

  useEffect(() => {
    let config = {
      method: 'get',
      url: `http://localhost:5000/userHomeStats?domain_name=${domainSelected}&start_date=${
        new Date(fromdate).toISOString().slice(0, 19).replace('T', ' ').split(' ')[0]
      }&end_date=${new Date(todate).toISOString().slice(0, 19).replace('T', ' ').split(' ')[0]}`,
      headers: { 
        'Authorization': `Bearer ${window.localStorage.getItem('token')}`
      },
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.parse(JSON.stringify(response.data.data.response)));
        setFilterTableData(JSON.parse(JSON.stringify(response.data.data.response)));
        setFilterData(JSON.parse(JSON.stringify(response.data.data)));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [fromdate, todate, domainSelected]);

  useEffect(() => {
    let config = {
      method: 'get',
      url: `http://localhost:5000/users_domains_by_user_id/${window.localStorage.getItem('id')}`,
      headers: {},
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.parse(JSON.stringify(response.data.data)));
        setAllDomainList(JSON.parse(JSON.stringify(response.data.data)));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filterData?.response?.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filterTableData) : 0;

  const filteredUsers = applySortFilter(filterTableData, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;
  const style = {
    position: 'absolute',
    top: '40%',
    left: '40%',
    transform: 'translate(-40%, -40%)',
    // width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 10,
  };

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={12} md={12} lg={12} container spacing={3} justifyContent="space-between">
              <Grid item xs={12} md={4} lg={4}>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Domain" defaultValue={0}>
                      <MenuItem  onClick={() => {
                              setDomainSelected('');
                            }} value={0}>Select Domain</MenuItem>
                      {allDomainList.map((domain) => {
                        return (
                          <MenuItem
                            onClick={() => {
                              setDomainSelected(domain.domainname);
                            }}
                            value={`${domain.domainname}`}
                          >
                            {domain.domainname}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Domain" defaultValue={20}>
                      <MenuItem
                        onClick={() => {
                          setFromDate(new Date().toISOString().slice(0, 19).replace('T', ' '));
                          setToDate(new Date().toISOString().slice(0, 19).replace('T', ' '));
                        }}
                        value={10}
                      >
                        Daily
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          const now = new Date();
                          setFromDate(
                            new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
                              .toISOString()
                              .slice(0, 19)
                              .replace('T', ' ')
                          );
                          setToDate(new Date().toISOString().slice(0, 19).replace('T', ' '));
                        }}
                        value={20}
                      >
                        Weekly
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          const now = new Date();
                          setFromDate(
                            new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)
                              .toISOString()
                              .slice(0, 19)
                              .replace('T', ' ')
                          );
                          setToDate(new Date().toISOString().slice(0, 19).replace('T', ' '));
                        }}
                        value={30}
                      >
                        Montly
                      </MenuItem>
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
                <Grid item xs={12} md={12} lg={12} container spacing={3} justifyContent="flex-start">
                  <Grid item xs={12} md={4} lg={4}>
                    <Box sx={{ minWidth: 120 }}>
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
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4} lg={4}>
                    <Box sx={{ minWidth: 120 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          renderInput={(props) => <TextField {...props} />}
                          label="To Date"
                          value={todate}
                          onChange={(newValue) => {
                            setToDate(newValue);
                          }}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Stack>
         <Grid container spacing={2} justifyContent="space-evenly">
          

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AppWidgetSummary title="Requests" total={filterData?.sums?.Calculated_Ad_Requests} color="info" icon={'ant-design:rise-outlined'} />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AppWidgetSummary
              title="Impressions"
              total={filterData?.sums?.Calculated_Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AppWidgetSummary
              title="Revenue"
              total={filterData?.sums?.Calculated_Revenue}
              color="info"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>
        </Grid>

        <Card sx={{ mt:4}}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800}}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={filterTableData}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      id,
                      Domain_name,
                      Ad_Requests,
                      Ad_Impressions,
                      Revenue,
                      eCPM,
                      Calculated_Ad_Requests,
                      Calculated_Ad_Impressions,
                      Calculated_Revenue,
                      create_at,
                    } = row;
                    const isItemSelected = selected.indexOf(Domain_name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {`${Domain_name}`}
                            </Typography>
                          </Stack>
                        </TableCell>
                        
                        <TableCell align="left">{fShortenNumber(eCPM)}</TableCell>
                        <TableCell align="left">{fShortenNumber(Calculated_Ad_Requests)}</TableCell>
                        <TableCell align="left">{fShortenNumber(Calculated_Ad_Impressions)}</TableCell>
                        <TableCell align="left">{fShortenNumber(Calculated_Revenue)}</TableCell>
                        {/* <TableCell align="left">{new Date(create_at).toString()}</TableCell> */}
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
                      <TableCell align="center" colSpan={9} sx={{ py: 3}}>
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
            count={filterTableData?.length}
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
