/* eslint-disable */
import * as React from 'react';
import FileUpload from 'react-material-file-upload';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import axios from 'axios';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Iconify from '../../../../components/Iconify';

const steps = ['User Detail', 'Payment details'];

export default function HorizontalLabelPositionBelowStepper(props) {
  const { isEdit, isView, data } = props;
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [showPassword, setShowPassword] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [isFileChange, setIsFileChange] = React.useState(false);
  const [isChangedPassword, setIsChangedPassword] = React.useState(false);


  const [files, setFiles] = React.useState([]);
  const [url, setURL] = React.useState('https://www.w3schools.com/howto/img_avatar.png');
  const [avatar, setAvatar] = React.useState('https://www.w3schools.com/howto/img_avatar.png');


  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [nameCardHolder, setNameCardHolder] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardExpire, setCardExpire] = React.useState(new Date());
  const [cardCSV, setCardCSV] = React.useState('');

  React.useEffect(() => {
    if (isEdit || isView) {
      let config = {
        method: 'get',
        url: `http://localhost:5000/users/${data?.id}`,
        headers: {},
      };
      axios(config)
        .then(function (response) {
          const User = JSON.parse(JSON.stringify(response.data.data));
          setURL(`http://localhost:5000/${User?.photo}`);
          setAvatar(User?.photo);
          setFirstName(User?.first_name);
          setLastName(User?.last_name);
          setPassword(User?.password);
          setEmail(User?.email);
          setNameCardHolder(User?.card_name);
          setCardNumber(User?.card_number);
          setCardExpire(User?.expiry_date);
          setCardCSV(User?.cvc);
          setDisabled(isEdit ? false : true);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, []);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      if (isEdit) {
        var newData = new FormData();
        newData.append('firstName', firstName);
        newData.append('lastName', lastName);
        newData.append('email', email);
        newData.append('password', password);
        newData.append('avatar', isFileChange?files[0]:avatar);
        newData.append('card_name', nameCardHolder);
        newData.append('card_number', cardNumber);
        newData.append('cvc', cardCSV);
        newData.append('expiry_date', new Date(cardExpire));
        newData.append('isFileChange', isFileChange);
        newData.append('isChangedPassword', isChangedPassword);


        var config = {
          method: 'put',
          url: `http://localhost:5000/user/update/${data?.id}`,
          headers: {},
          data: newData,
        };

        axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            setActiveStep(activeStep + 1);
          })
          .catch(function (error) {
            if (error.response) {
              // Request made and server responded
              alert(error.response?.data?.message);
            } else if (error.request) {
              // The request was made but no response was received
              alert('Something is Wrong!');
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              alert('Something is Wrong!');
              console.log('Error', error.message);
            }
          });
      } else {
        if (files.length > 0) {
          var newData = new FormData();
          newData.append('firstName', firstName);
          newData.append('lastName', lastName);
          newData.append('email', email);
          newData.append('password', password);
          newData.append('avatar', files[0]);
          newData.append('card_name', nameCardHolder);
          newData.append('card_number', cardNumber);
          newData.append('cvc', cardCSV);
          newData.append('expiry_date', new Date(cardExpire));

          var config = {
            method: 'post',
            url: 'http://localhost:5000/user/add',
            headers: {},
            data: newData,
          };

          axios(config)
            .then(function (response) {
              console.log(JSON.stringify(response.data));
              setActiveStep(activeStep + 1);
            })
            .catch(function (error) {
              if (error.response) {
                // Request made and server responded
                alert(error.response?.data?.message);
              } else if (error.request) {
                // The request was made but no response was received
                alert('Something is Wrong!');
                console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                alert('Something is Wrong!');
                console.log('Error', error.message);
              }
            });
        } else {
          alert('Please select image!');
        }
      }
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const fileToDataUri = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });

  const setUserImage = (e) => {
    fileToDataUri(e.target.files[0]).then((dataUri) => {
      isEdit ? setIsFileChange(true) : null;
      setURL(dataUri);
      setFiles(e.target.files);
    });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <React.Fragment>
            <Typography variant="h6" gutterBottom>
              User Detail
            </Typography>
            <Grid container spacing={0}>
              <div>
                <input
                  accept="image/*"
                  style={{
                    display: 'none',
                  }}
                  id="icon-button-file"
                  type="file"
                  disabled={disabled}
                  onChange={(e) => {
                    setUserImage(e);
                  }}
                />
                <label htmlFor="icon-button-file">
                  <IconButton color="primary" aria-label="upload picture" component="span">
                    <Avatar src={url} sx={{ width: 70, height: 70 }} />
                  </IconButton>
                </label>
              </div>

              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    required
                    id="firstName"
                    disabled={disabled}
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <TextField
                    required
                    id="lastName"
                    disabled={disabled}
                    value={lastName}
                    label="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Stack>
                <TextField
                  required
                  id="email"
                  label="Email"
                  disabled={disabled}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  required
                  name="password"
                  label="Password"
                  disabled={disabled}
                  value={isEdit ? isChangedPassword?password:'' : password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    isEdit ? setIsChangedPassword(true) : null
                    

                  }}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: !isView ? (
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                />
              </Stack>
            </Grid>
          </React.Fragment>
        );
      case 1:
        return (
          <React.Fragment>
            <Typography variant="h6" gutterBottom>
              Payment method
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  id="cardName"
                  label="Name on card"
                  value={nameCardHolder}
                  disabled={disabled}
                  fullWidth
                  autoComplete="cc-name"
                  onChange={(e) => setNameCardHolder(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  id="cardNumber"
                  label="Card number"
                  value={cardNumber}
                  disabled={disabled}
                  fullWidth
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  autoComplete="cc-number"
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    // inputFormat="yyyy-MM"
                    views={['year', 'month']}
                    renderInput={(props) => <TextField {...props} />}
                    label="Date"
                    disabled={disabled}
                    value={cardExpire}
                    onChange={(newValue) => {
                      setCardExpire(newValue);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  id="cvv"
                  label="CVV"
                  value={cardCSV}
                  disabled={disabled}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  helperText="Last three digits on signature strip"
                  fullWidth
                  autoComplete="cc-csc"
                  onChange={(e) => setCardCSV(e.target.value)}
                />
              </Grid>
            </Grid>
          </React.Fragment>
        );
      default:
        throw new Error('Unknown step');
    }
  };
  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4, top: '30%' }}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center">
          Add New User
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography variant="h5" gutterBottom>
              User Added Successfully!
            </Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                  Back
                </Button>
              )}

              {activeStep === steps.length - 1 ? (
                isView ? null : (
                  <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
                    Submit
                  </Button>
                )
              ) : (
                <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
                  Next
                </Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </Paper>
    </Container>
  );
}
