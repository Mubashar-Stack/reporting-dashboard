/* eslint-disable */
import { filter } from 'lodash';
import React, { useState } from 'react';
import { sentenceCase } from 'change-case';

import { Link as RouterLink } from 'react-router-dom';
import FileUpload from 'react-material-file-upload';
// material
import { styled } from '@mui/material/styles';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TextField,
  FormControl,
  Grid,
  InputLabel,
  InputAdornment,
  Input,
} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { LoadingButton } from '@mui/lab';

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// import { RegisterForm } from '../sections/@dashboard/user/add';

// mock
// import USERLIST from '../_mock/user';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'file', label: 'File', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'createdAt', label: 'Created At', alignRight: false },
];

const USERLIST = [
  {
    id: 1,
    name: 'First upload',
    file: 'csv-file.csv',
    status: 'uploaded',
    createdAt: '2022-10-17',
  },
];

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  // margin: 'auto',
  minHeight: '70vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(4, 12),
  margin: theme.spacing(3, 0),
  backgroundColor: '#fff',
}));
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UploadReports() {
  /* eslint-disable */
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const [files, setFiles] = useState([]);
  const [fromdate, setFromDate] = useState(dayjs(new Date()));

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [issuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const handleIsSuccessOpen = () => setIsSuccess(true);
  const handleIsSuccessClose = () => setIsSuccess(false);
  const [isFail, setIsFail] = useState(false);
  const handleIsFailOpen = () => setIsFail(true);
  const handleIsFailClose = () => setIsFail(false);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChange = (files) => {
    console.log(files);
    // setFiles({
    //   files: files
    // });
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
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

  const uploadReport = () => {
    setIsSubmitting(true);
    const data = new FormData();
    data.append('date', new Date(fromdate));
    data.append('report', files[0]);
    data.append('commission', '20');
    const config = {
      method: 'post',
      url: 'http://localhost:5000/reports/new',
      // headers: { 'content-type': 'multipart/form-data' },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setMessage(response?.data?.message);
        setIsSubmitting(false);
        setFromDate(new Date());
        setFiles([]);
        handleClose();
        handleIsSuccessOpen();
      })
      .catch(function (error) {
        console.log(error);
        setMessage('Something goes wrong!');
        setIsSubmitting(false);
        handleClose();
        handleIsFailOpen();
      });
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;
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
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Reports
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpen}
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Add New Report
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Container maxWidth="sm">
              <ContentStyle>
                <Typography variant="h4" gutterBottom>
                  Add New Report
                </Typography>

                <Typography sx={{ color: 'text.secondary', mb: 2 }}>Enter your details below.</Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Date"
                    value={fromdate}
                    onChange={(newValue) => {
                      setFromDate(newValue);
                    }}
                  />
                </LocalizationProvider>

                <InputLabel htmlFor="standard-adornment-amount" style={{ marginTop: 10 }}>
                  Commission
                </InputLabel>
                <Input
                  id="standard-adornment-amount"
                  value={20}
                  disabled
                  onChange={handleChange('Commission')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  style={{ marginBottom: 10 }}
                />

                <FileUpload value={files} onChange={setFiles} accept=".csv" />
                <LoadingButton
                  fullWidth
                  size="large"
                  variant="contained"
                  style={{ marginTop: 10 }}
                  onClick={uploadReport}
                  loading={isSubmitting}
                >
                  Upload Report
                </LoadingButton>
              </ContentStyle>
            </Container>
          </Modal>
        </Stack>

        <Card>
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
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const { id, name, file, status, createdAt } = row;
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
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={`/static/mock-images/avatars/avatar_${index + 1}.jpg`} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{file}</TableCell>
                        <TableCell align="left">
                          <Label variant="ghost" color="success">
                            {sentenceCase(status)}
                          </Label>
                        </TableCell>
                        <TableCell align="left">{createdAt}</TableCell>

                        <TableCell align="right">
                          <UserMoreMenu row={row} />
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
        <Snackbar open={issuccess} autoHideDuration={6000} onClose={handleIsSuccessClose}>
          <Alert onClose={handleIsSuccessClose} severity="success" sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
        <Snackbar open={isFail} autoHideDuration={6000} onClose={handleIsFailClose}>
          <Alert onClose={handleIsFailClose} severity="error" sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </Container>
    </Page>
  );
}
