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
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';

const steps = ['Domain Detail'];

export default function HorizontalLabelPositionBelowStepper(props) {
  const { isEdit, isView, data } = props;
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [disabled, setDisabled] = React.useState(false);
  const [isFileChange, setIsFileChange] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [userID, setUserID] = React.useState('');
  const [domainID, setDomainID] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [domainName, setDomainName] = React.useState('');
  const [usersList, setUsersList] = React.useState([]);
  const [domainList, setDomainList] = React.useState([]);

  React.useEffect(() => {
    let config = {
      method: 'get',
      url: 'http://localhost:5000/users',
      headers: {},
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.parse(JSON.stringify(response.data.data)));
        setUsersList(JSON.parse(JSON.stringify(response.data.data)));
      })
      .catch(function (error) {
        console.log(error);
      });
    let configDomain = {
      method: 'get',
      url: 'http://localhost:5000/domains',
      headers: {},
    };
    axios(configDomain)
      .then(function (response) {
        console.log(JSON.parse(JSON.stringify(response.data.data)));
        setDomainList(JSON.parse(JSON.stringify(response.data.data)));
      })
      .catch(function (error) {
        console.log(error);
      });
    if (isEdit || isView) {
      let config = {
        method: 'get',
        url: `http://localhost:5000/users_domains/${data?.id}`,
        headers: {},
      };
      axios(config)
        .then(function (response) {
          console.log(JSON.parse(JSON.stringify(response.data.data)));
          const Domain = JSON.parse(JSON.stringify(response.data.data));
          setUserName(Domain?.first_name);
          setDomainName(Domain?.domainname);
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
        newData.append('user_id', userID);

        newData.append('domain_id', domainID);

        var config = {
          method: 'put',
          url: `http://localhost:5000/user_domain/update/${data?.id}`,
          headers: {},
          data: newData,
        };

        axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            setActiveStep(activeStep + 1);
            window.location.reload();
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
        var newData = new FormData();
        newData.append('user_id', userID);

        newData.append('domain_id', domainID);

        var config = {
          method: 'post',
          url: 'http://localhost:5000/user_domain/add',
          headers: {},
          data: newData,
        };

        axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            setActiveStep(activeStep + 1);
            window.location.reload();
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
      }
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <React.Fragment>
            <Grid container spacing={0}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Autocomplete
                  id="country-select-demo"
                  sx={{ width: 220 }}
                  options={domainList}
                  autoHighlight
                  inputValue={domainName}
                  // value={domainName}
                  onChange={(event, newValue) => {
                    setDomainID(newValue.id);
                    setDomainName(newValue.domainname);
                  }}
                  onInputChange={(event, newInputValue) => {
                    setDomainName(newInputValue);
                  }}
                  getOptionLabel={(option) => option.domainname}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      {option.domainname}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Choose a Domain"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
                <Autocomplete
                  id="country-select-demo"
                  sx={{ width: 220 }}
                  options={usersList}
                  inputValue={userName}
                  // value={userName}
                  autoHighlight
                  onChange={(event, newValue) => {
                    setUserID(newValue.id);
                    setUserName(newValue.first_name);
                  }}
                  onInputChange={(event, newInputValue) => {
                    setUserName(newInputValue);
                  }}
                  getOptionLabel={(option) => option.first_name}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      <img
                        loading="lazy"
                        width="20"
                        src={`http://localhost:5000/${option?.photo}`}
                        srcSet={`http://localhost:5000/${option?.photo}.png 2x`}
                        alt=""
                      />
                      {option.first_name} {option.last_name}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Choose a User"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </Stack>
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
          Add New Domain
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
              Domain Added Successfully!
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
