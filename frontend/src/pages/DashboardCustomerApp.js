/* eslint-disable */
import React, { useState, useEffect } from 'react';

import { Grid, Container, Typography } from '@mui/material';

// components
import Page from '../components/Page';

import axios from 'axios';
// sections
import { AppWidgetSummary } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [homeStatsFixed, setHomeStatsFixed] = useState(null);

  useEffect(() => {
    let config = {
      method: 'get',
      url: 'http://localhost:5000/userHomeStatsFixed',
      headers: { 
        'Authorization': `Bearer ${window.localStorage.getItem('token')}`
      }
    };
    axios(config)
      .then(function (response) {
        setHomeStatsFixed(JSON.parse(JSON.stringify(response.data.data)));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>
        <Typography variant="h3" gutterBottom>
          Total Stats
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="Today Requests"
              total={homeStatsFixed?.todayStats?.Calculated_Ad_Requests}
              color="info"
              icon={'ant-design:rise-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="Today Impressions"
              total={homeStatsFixed?.todayStats?.Calculated_Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="Today Revenue"
              total={homeStatsFixed?.todayStats?.calculatedRevenue}
              color="info"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>
        {/* </Grid>
        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          Yesterday Stats
        </Typography>
        <Grid container spacing={2} justifyContent="space-between"> */}
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="Yesterday Requests"
              total={homeStatsFixed?.yesterdayStats?.Calculated_Ad_Requests}
              color="info"
              icon={'ant-design:rise-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="Yesterday Impressions"
              total={homeStatsFixed?.yesterdayStats?.Calculated_Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="Yesterday Revenue"
              total={homeStatsFixed?.yesterdayStats?.calculatedRevenue}
              color="info"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>
        {/* </Grid>
        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          This Week Stats
        </Typography>
        <Grid container spacing={2} justifyContent="space-between"> */}
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="This Week Requests"
              total={homeStatsFixed?.thisWeekStats?.Calculated_Ad_Requests}
              color="info"
              icon={'ant-design:rise-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="This Week Impressions"
              total={homeStatsFixed?.thisWeekStats?.Calculated_Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="This Week Revenue"
              total={homeStatsFixed?.thisWeekStats?.calculatedRevenue}
              color="info"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>
        {/* </Grid>
        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          Last Week Stats
        </Typography>
        <Grid container spacing={2} justifyContent="space-between"> */}
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="Last Week Requests"
              total={homeStatsFixed?.lastWeekStats?.Calculated_Ad_Requests}
              color="info"
              icon={'ant-design:rise-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="Last Week Impressions"
              total={homeStatsFixed?.lastWeekStats?.Calculated_Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="Last Week Revenue"
              total={homeStatsFixed?.lastWeekStats?.calculatedRevenue}
              color="info"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>
        {/* </Grid>
        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          This Month Stats
        </Typography>
        <Grid container spacing={2} justifyContent="space-between"> */}
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="This Month Requests"
              total={homeStatsFixed?.currentMonthStats?.Calculated_Ad_Requests}
              color="info"
              icon={'ant-design:rise-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="This Month Impressions"
              total={homeStatsFixed?.currentMonthStats?.Calculated_Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="This Month Revenue"
              total={homeStatsFixed?.currentMonthStats?.calculatedRevenue}
              color="info"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>
        {/* </Grid> */}
        {/* <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          Last Month Stats
        </Typography> */}
        {/* <Grid container spacing={2} justifyContent="space-between"> */}
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="Last Month Requests"
              total={homeStatsFixed?.lastMonthStats?.Calculated_Ad_Requests}
              color="info"
              icon={'ant-design:rise-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="Last Month Impressions"
              total={homeStatsFixed?.lastMonthStats?.Calculated_Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.3}>
            <AppWidgetSummary
              title="Last Month Revenue"
              total={homeStatsFixed?.lastMonthStats?.calculatedRevenue}
              color="info"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
