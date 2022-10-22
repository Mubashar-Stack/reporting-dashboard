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

import Iconify from '../../../../components/Iconify';

const steps = ['User Detail', 'Payment details'];

export default function HorizontalLabelPositionBelowStepper() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [showPassword, setShowPassword] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [url, setURL] = React.useState('https://www.w3schools.com/howto/img_avatar.png');

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [nameCardHolder, setNameCardHolder] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardExpire, setCardExpire] = React.useState('');
  const [cardCSV, setCardCSV] = React.useState('');

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      const values = {
        firstName: firstName,
        lastName: lastName,
        photo: files,
        email: email,
        password: password,
      };
      console.log(values,'values');
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
                    label="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <TextField required id="lastName" label="Last Name" onChange={(e) => setLastName(e.target.value)} />
                </Stack>
                <TextField required id="email" label="Email" onChange={(e) => setEmail(e.target.value)} />
                <TextField
                  required
                  name="password"
                  label="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
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
                  fullWidth
                  autoComplete="cc-name"
                  variant="standard"
                  onChange={(e) => setNameCardHolder(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  id="cardNumber"
                  label="Card number"
                  fullWidth
                  autoComplete="cc-number"
                  variant="standard"
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  id="expDate"
                  label="Expiry date"
                  fullWidth
                  autoComplete="cc-exp"
                  variant="standard"
                  onChange={(e) => setCardExpire(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  id="cvv"
                  label="CVV"
                  helperText="Last three digits on signature strip"
                  fullWidth
                  autoComplete="cc-csc"
                  variant="standard"
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
              Thank you for your order.
            </Typography>
            <Typography variant="subtitle1">
              Your order number is #2001539. We have emailed your order confirmation, and will send you an update when
              your order has shipped.
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

              <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Paper>
    </Container>
  );
}
