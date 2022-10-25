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
      url: 'http://localhost:5000/homeStatsFixed',
      headers: {},
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
        <Typography variant="h6" gutterBottom>
          Today Stats
        </Typography>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Requests"
              total={homeStatsFixed?.todayStats?.Ad_Requests}
              icon={'ant-design:rise-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Impressions"
              total={homeStatsFixed?.todayStats?.Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Revenue"
              total={homeStatsFixed?.todayStats?.revenue}
              color="warning"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Requests"
              total={homeStatsFixed?.todayStats?.Calculated_Ad_Requests}
              color="info"
              icon={'ant-design:rise-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Impressions"
              total={homeStatsFixed?.todayStats?.Calculated_Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Revenue"
              total={homeStatsFixed?.todayStats?.calculatedRevenue}
              color="info"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>
        </Grid>
        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          Yesterday Stats
        </Typography>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Requests"
              total={homeStatsFixed?.yesterdayStats?.Ad_Requests}
              icon={'ant-design:rise-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Impressions"
              total={homeStatsFixed?.yesterdayStats?.Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Revenue"
              total={homeStatsFixed?.yesterdayStats?.revenue}
              color="warning"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Requests"
              total={homeStatsFixed?.yesterdayStats?.Calculated_Ad_Requests}
              color="info"
              icon={'ant-design:rise-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Impressions"
              total={homeStatsFixed?.yesterdayStats?.Calculated_Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Revenue"
              total={homeStatsFixed?.yesterdayStats?.calculatedRevenue}
              color="info"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>
        </Grid>
        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          Current Week Stats
        </Typography>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Requests"
              total={homeStatsFixed?.thisWeekStats?.Ad_Requests}
              icon={'ant-design:rise-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Impressions"
              total={homeStatsFixed?.thisWeekStats?.Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Revenue"
              total={homeStatsFixed?.thisWeekStats?.revenue}
              color="warning"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Requests"
              total={homeStatsFixed?.thisWeekStats?.Calculated_Ad_Requests}
              color="info"
              icon={'ant-design:rise-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Impressions"
              total={homeStatsFixed?.thisWeekStats?.Calculated_Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Revenue"
              total={homeStatsFixed?.thisWeekStats?.calculatedRevenue}
              color="info"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>
        </Grid>
        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          Last Week Stats
        </Typography>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Requests"
              total={homeStatsFixed?.lastWeekStats?.Ad_Requests}
              icon={'ant-design:rise-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Impressions"
              total={homeStatsFixed?.lastWeekStats?.Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Revenue"
              total={homeStatsFixed?.lastWeekStats?.revenue}
              color="warning"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Requests"
              total={homeStatsFixed?.lastWeekStats?.Calculated_Ad_Requests}
              color="info"
              icon={'ant-design:rise-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Impressions"
              total={homeStatsFixed?.lastWeekStats?.Calculated_Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Revenue"
              total={homeStatsFixed?.lastWeekStats?.calculatedRevenue}
              color="info"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>
        </Grid>
        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          Current Month Stats
        </Typography>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Requests"
              total={homeStatsFixed?.currentMonthStats?.Ad_Requests}
              icon={'ant-design:rise-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Impressions"
              total={homeStatsFixed?.currentMonthStats?.Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Revenue"
              total={homeStatsFixed?.currentMonthStats?.revenue}
              color="warning"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Requests"
              total={homeStatsFixed?.currentMonthStats?.Calculated_Ad_Requests}
              color="info"
              icon={'ant-design:rise-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Impressions"
              total={homeStatsFixed?.currentMonthStats?.Calculated_Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Revenue"
              total={homeStatsFixed?.currentMonthStats?.calculatedRevenue}
              color="info"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>
        </Grid>
        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          Last Month Stats
        </Typography>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Requests"
              total={homeStatsFixed?.lastMonthStats?.Ad_Requests}
              icon={'ant-design:rise-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Impressions"
              total={homeStatsFixed?.lastMonthStats?.Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Total Revenue"
              total={homeStatsFixed?.lastMonthStats?.revenue}
              color="warning"
              icon={'ant-design:dollar-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Requests"
              total={homeStatsFixed?.lastMonthStats?.Calculated_Ad_Requests}
              color="info"
              icon={'ant-design:rise-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Impressions"
              total={homeStatsFixed?.lastMonthStats?.Calculated_Ad_Impressions}
              color="info"
              icon={'ant-design:line-chart-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AppWidgetSummary
              title="Revenue"
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
