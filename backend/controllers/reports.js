const ModalReport = require("../models/report");
const User =require("../models/user")
const csv = require("fast-csv");
const fs = require("fs");
const { db_read, db_write } = require("../config/db");

/**
 * Returns User List if found in db
 * @param req
 * @param res
 * @returns {*}
 */
 function getAllFiles(req, res) {
  try {

    ModalReport.getFiles((err, response) => {
      if (!err && response) {
        return res.json({
          message: "success",
          data: response,
        });
      }
      return res.status(401).send({
        error: "Not Found",
        message: "No user found.",
      });
    });
  } catch (e) {}
}

/**
 * @param req
 * @param res
 * @returns {*}
 */


 async function getHomeStats(req, res) {
  try {
    const {domain_name, start_date, end_date} = req.query
    let responseArray = []
    let total = {Ad_Requests: 0, Ad_Impressions: 0, Revenue: 0, Calculated_Ad_Requests: 0, Calculated_Ad_Impressions: 0, Calculated_Revenue: 0}

    console.log(domain_name, start_date, end_date);
    const data = {
      Domain_name: domain_name? domain_name :"",
      start_date: start_date? start_date : "",
      end_date: end_date? end_date : ""
    }
    /*
    alternate code if asked to not calculate cur and last month revenue in every call
    ModalReport.getReports(data, (err, response) => {
      if (!err && response) {
        // console.log('response', response);

        response.map(respons =>{
          console.log('respons', respons);
          //we can round this value if req arises i.e Math.round(respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission))))
          respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
          respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
          respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))

        })

        return res.json({
          message: "success",
          data: response,
        });
      }
      return res.status(401).send({
        error: "Not Found",
        message: "No user found.",
      });
    });
    */
    await ModalReport.getReports(data, async (err, response) => {
      if (!err && response) {
        // console.log('response', response);
        await Promise.all(
          response.map(respons =>{
            console.log('respons', respons);
            //we can round this value if req arises i.e Math.round(respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission))))
            respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            total.Ad_Requests += respons.Ad_Requests
            total.Ad_Impressions += respons.Ad_Impressions
            total.Revenue += respons.Revenue
            total.Calculated_Ad_Requests += respons.Calculated_Ad_Requests
            total.Calculated_Ad_Impressions += respons.Calculated_Ad_Impressions
            total.Calculated_Revenue += respons.Calculated_Revenue
          })
          )
        console.log('total', total);
        responseArray = response
      }
    });

    return res.json({
      message: "success",
      data: {response: responseArray, sums: total},
    });
  } catch (e) {}
}


const verifyToken = async (token) => {
  try {
    return await User.findById(JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).sub, (err, response) => {
      if (!err && response) {
        return response
      }
      return err
    })
    
  } catch (error) {
    console.log(error);
  }
}


async function getUserHomeStats(req, res) {
  try {
    if(!req.headers.authorization)
      res.status(400).json('Token required')
    const token = req.headers.authorization.split(" ")[1];
    req.user = await verifyToken(token);
    if(!req.user)
      res.status(404).json('User not found!')
    console.log('req.user', req.user);
    const {domain_name, start_date, end_date} = req.query
    let responseArray = []
    let total = {Ad_Requests: 0, Ad_Impressions: 0, Revenue: 0, Calculated_Ad_Requests: 0, Calculated_Ad_Impressions: 0, Calculated_Revenue: 0}

    console.log(domain_name, start_date, end_date);
    const data = {
      userId : req.user.id,
      Domain_name: domain_name? domain_name :"",
      start_date: start_date? start_date : "",
      end_date: end_date? end_date : ""
    }
    console.log('whats the update?', data);
    await ModalReport.getUserReports(data, async (err, response) => {
      if (!err && response) {
        // console.log('response', response);
        await Promise.all(
          response.map(respons =>{
            console.log('respons', respons);
            //we can round this value if req arises i.e Math.round(respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission))))
            respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            total.Ad_Requests += respons.Ad_Requests
            total.Ad_Impressions += respons.Ad_Impressions
            total.Revenue += respons.Revenue
            total.Calculated_Ad_Requests += respons.Calculated_Ad_Requests
            total.Calculated_Ad_Impressions += respons.Calculated_Ad_Impressions
            total.Calculated_Revenue += respons.Calculated_Revenue
          })
          )
        console.log('total', total);
        responseArray = response
      }
    });

    return res.json({
      message: "success",
      data: {response: responseArray, sums: total},
    });
  } catch (e) {}
}


async function getHomeStatsFixed(req, res) {
  try {

    let currentMonthStats= {Ad_Requests:0, Calculated_Ad_Requests:0, Ad_Impressions:0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0}
    let lastMonthStats= {Ad_Requests:0, Calculated_Ad_Requests:0, Ad_Impressions:0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0}
    let thisWeekStats= {Ad_Requests:0, Calculated_Ad_Requests:0, Ad_Impressions:0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0}
    let lastWeekStats= {Ad_Requests:0, Calculated_Ad_Requests:0, Ad_Impressions:0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0}
    let todayStats= {Ad_Requests:0, Calculated_Ad_Requests:0, Ad_Impressions:0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0}
    let yesterdayStats= {Ad_Requests:0, Calculated_Ad_Requests:0, Ad_Impressions:0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0}
    let currentYearStats= {Ad_Requests:0, Calculated_Ad_Requests:0, Ad_Impressions:0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0}
    let monthwiseData = {
      jan: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      feb: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      mar: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      apr: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      may: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      jun: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      jul: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      aug: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      sep: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      oct: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      nov: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      dec: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 }
    }


    let date = new Date();
    let firstDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    let lastDayLastDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

    await ModalReport.getReports({Domain_name: "", start_date: firstDayOfCurrentMonth, end_date: lastDayLastDayOfCurrentMonth}, async (err, response) => {
      if (!err && response) {
        // console.log('response', response);

        await Promise.all(
          response.map(respons =>{
            // console.log('respons', respons);
            respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            currentMonthStats.Ad_Requests += respons.Ad_Requests
            currentMonthStats.Ad_Impressions += respons.Ad_Impressions
            currentMonthStats.Calculated_Ad_Requests += respons.Calculated_Ad_Requests
            currentMonthStats.Calculated_Ad_Impressions += respons.Calculated_Ad_Impressions
            currentMonthStats.revenue += respons.Revenue
            currentMonthStats.calculatedRevenue += respons.Calculated_Revenue
          })
        )
      }
    });

    let firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth()-1, 1).toISOString().split('T')[0];
    let lastDayLastDayOfLastMonth = new Date(date.getFullYear(), date.getMonth() , 0).toISOString().split('T')[0];

    await ModalReport.getReports({Domain_name: "", start_date: firstDayOfLastMonth, end_date: lastDayLastDayOfLastMonth}, async (err, response) => {
      console.log('err :/'. err);
      if (!err && response) {
        // console.log('response', response);

        await Promise.all(
          response.map(respons =>{
            // console.log('respons', respons);
            respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            lastMonthStats.Ad_Requests += respons.Ad_Requests
            lastMonthStats.Ad_Impressions += respons.Ad_Impressions
            lastMonthStats.Calculated_Ad_Requests += respons.Calculated_Ad_Requests
            lastMonthStats.Calculated_Ad_Impressions += respons.Calculated_Ad_Impressions
            lastMonthStats.revenue += respons.Revenue
            lastMonthStats.calculatedRevenue += respons.Calculated_Revenue
          })
        )
      }
    });

    let today = new Date().toISOString().split('T')[0]
    console.log('today', today);
    await ModalReport.getReports({Domain_name: "", start_date: today, end_date: today}, async (err, response) => {
      console.log('err :/'. err);
      if (!err && response) {
        // console.log('response', response);

        await Promise.all(
          response.map(respons =>{
            console.log('respons', respons);
            respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            todayStats.Ad_Requests += respons.Ad_Requests
            todayStats.Ad_Impressions += respons.Ad_Impressions
            todayStats.Calculated_Ad_Requests += respons.Calculated_Ad_Requests
            todayStats.Calculated_Ad_Impressions += respons.Calculated_Ad_Impressions
            todayStats.revenue += respons.Revenue
            todayStats.calculatedRevenue += respons.Calculated_Revenue
          })
        )
      }
    });

    let yesterDay = new Date()
    yesterDay.setDate(yesterDay.getDate()-1)
    yesterDay = yesterDay.toISOString().split('T')[0]
    console.log('yesterDay', yesterDay);

    await ModalReport.getReports({Domain_name: "", start_date: yesterDay, end_date: yesterDay}, async (err, response) => {
      console.log('err :/'. err);
      if (!err && response) {
        console.log('response', response);

        await Promise.all(
          response.map(respons =>{
            // console.log('respons', respons);
            respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            yesterdayStats.Ad_Requests += respons.Ad_Requests
            yesterdayStats.Ad_Impressions += respons.Ad_Impressions
            yesterdayStats.Calculated_Ad_Requests += respons.Calculated_Ad_Requests
            yesterdayStats.Calculated_Ad_Impressions += respons.Calculated_Ad_Impressions
            yesterdayStats.revenue += respons.Revenue
            yesterdayStats.calculatedRevenue += respons.Calculated_Revenue
          })
        )
      }
    });

    let firstDay = date.getDate() - date.getDay(); 
    let lastDay = firstDay + 6; 

    let firstDayThisWeek = new Date(date.setDate(firstDay)).toISOString().split('T')[0];
    let lastDayThisWeek = new Date(date.setDate(lastDay)).toISOString().split('T')[0];
    console.log('firstDayThisWeek', firstDayThisWeek, 'lastDayThisWeek', lastDayThisWeek);
    await ModalReport.getReports({Domain_name: "", start_date: firstDayThisWeek, end_date: lastDayThisWeek}, async (err, response) => {
      console.log('err :/'. err);
      if (!err && response) {
        console.log('response', response);

        await Promise.all(
          response.map(respons =>{
            // console.log('respons', respons);
            respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            thisWeekStats.Ad_Requests += respons.Ad_Requests
            thisWeekStats.Ad_Impressions += respons.Ad_Impressions
            thisWeekStats.Calculated_Ad_Requests += respons.Calculated_Ad_Requests
            thisWeekStats.Calculated_Ad_Impressions += respons.Calculated_Ad_Impressions
            thisWeekStats.revenue += respons.Revenue
            thisWeekStats.calculatedRevenue += respons.Calculated_Revenue
          })
        )
      }
    });

    let date1 =new Date()
    let firstDay1 = date1.getDate() - date1.getDay()-7; 
    let lastDay1 = firstDay1 + 6; 

    let firstDayLastWeek = new Date(date1.setDate(firstDay1)).toISOString().split('T')[0];
    let lastDayLastWeek = new Date(date1.setDate(lastDay1)).toISOString().split('T')[0];
    console.log('firstDayPrevWeek', firstDayLastWeek, 'lastDayThisWeek', lastDayLastWeek);
    await ModalReport.getReports({Domain_name: "", start_date: firstDayLastWeek, end_date: lastDayLastWeek}, async (err, response) => {
      console.log('err :/'. err);
      if (!err && response) {
        console.log('response', response);

        await Promise.all(
          response.map(respons =>{
            // console.log('respons', respons);
            respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            lastWeekStats.Ad_Requests += respons.Ad_Requests
            lastWeekStats.Ad_Impressions += respons.Ad_Impressions
            lastWeekStats.Calculated_Ad_Requests += respons.Calculated_Ad_Requests
            lastWeekStats.Calculated_Ad_Impressions += respons.Calculated_Ad_Impressions
            lastWeekStats.revenue += respons.Revenue
            lastWeekStats.calculatedRevenue += respons.Calculated_Revenue
          })
        )
      }
    });

    const currentYear = new Date().getFullYear();
    const currentYearFirstDay = new Date(currentYear, 0, 1);
    const currentYearLastDay = new Date(currentYear, 11, 31);

    await ModalReport.getReports({ Domain_name: "", start_date: currentYearFirstDay, end_date: currentYearLastDay }, async (err, response) => {
      console.log('err :/'.err);
      if (!err && response) {
        console.log('response', response);

        await Promise.all(
          response.map(respons => {

            let createDate = new Date(respons.create_at)
            console.log('createDate.getMonth()', createDate.getMonth());
            if (createDate.getMonth() == 0) {
              monthwiseData.jan.Ad_Requests += respons.Ad_Requests
              monthwiseData.jan.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.jan.Revenue += respons.Revenue
              monthwiseData.jan.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.jan.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.jan.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 1) {
              monthwiseData.feb.Ad_Requests += respons.Ad_Requests
              monthwiseData.feb.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.feb.Revenue += respons.Revenue
              monthwiseData.feb.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.feb.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.feb.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 2) {
              monthwiseData.mar.Ad_Requests += respons.Ad_Requests
              monthwiseData.mar.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.mar.Revenue += respons.Revenue
              monthwiseData.mar.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.mar.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.mar.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 3) {
              monthwiseData.apr.Ad_Requests += respons.Ad_Requests
              monthwiseData.apr.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.apr.Revenue += respons.Revenue
              monthwiseData.apr.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.apr.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.apr.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 4) {
              monthwiseData.may.Ad_Requests += respons.Ad_Requests
              monthwiseData.may.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.may.Revenue += respons.Revenue
              monthwiseData.may.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.may.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.may.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 5) {
              monthwiseData.jun.Ad_Requests += respons.Ad_Requests
              monthwiseData.jun.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.jun.Revenue += respons.Revenue
              monthwiseData.jun.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.jun.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.jun.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 6) {
              monthwiseData.jul.Ad_Requests += respons.Ad_Requests
              monthwiseData.jul.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.jul.Revenue += respons.Revenue
              monthwiseData.jul.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.jul.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.jul.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 7) {
              monthwiseData.aug.Ad_Requests += respons.Ad_Requests
              monthwiseData.aug.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.aug.Revenue += respons.Revenue
              monthwiseData.aug.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.aug.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.aug.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 8) {
              monthwiseData.sep.Ad_Requests += respons.Ad_Requests
              monthwiseData.sep.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.sep.Revenue += respons.Revenue
              monthwiseData.sep.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.sep.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.sep.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 9) {
              monthwiseData.oct.Ad_Requests += respons.Ad_Requests
              monthwiseData.oct.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.oct.Revenue += respons.Revenue
              monthwiseData.oct.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.oct.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.oct.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 10) {
              monthwiseData.nov.Ad_Requests += respons.Ad_Requests
              monthwiseData.nov.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.nov.Revenue += respons.Revenue
              monthwiseData.nov.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.nov.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.nov.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 11) {
              monthwiseData.dec.Ad_Requests += respons.Ad_Requests
              monthwiseData.dec.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.dec.Revenue += respons.Revenue
              monthwiseData.dec.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.dec.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.dec.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
          })
        )
      }
    });

    console.log('monthwiseData', monthwiseData);

    return res.json({
      message: "success",
      data: { thisWeekStats, lastWeekStats, todayStats, yesterdayStats, currentMonthStats, lastMonthStats},
      monthwiseData
    });
  } catch (e) {}
}

async function getUserHomeStatsFixed(req, res) {
  try {

    if(!req.headers.authorization)
      res.status(400).json('Token required')
    const token = req.headers.authorization.split(" ")[1];
    req.user = await verifyToken(token);
    if(!req.user)
      res.status(404).json('User not found!')
    console.log('req.user', req.user);

    let currentMonthStats= {Ad_Requests:0, Calculated_Ad_Requests:0, Ad_Impressions:0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0}
    let lastMonthStats= {Ad_Requests:0, Calculated_Ad_Requests:0, Ad_Impressions:0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0}
    let thisWeekStats= {Ad_Requests:0, Calculated_Ad_Requests:0, Ad_Impressions:0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0}
    let lastWeekStats= {Ad_Requests:0, Calculated_Ad_Requests:0, Ad_Impressions:0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0}
    let todayStats= {Ad_Requests:0, Calculated_Ad_Requests:0, Ad_Impressions:0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0}
    let yesterdayStats= {Ad_Requests:0, Calculated_Ad_Requests:0, Ad_Impressions:0, Calculated_Ad_Impressions: 0, revenue: 0, calculatedRevenue: 0}
    let monthwiseData = {
      jan: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      feb: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      mar: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      apr: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      may: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      jun: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      jul: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      aug: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      sep: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      oct: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      nov: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 },
      dec: { Ad_Requests: 0, Calculated_Ad_Requests: 0, Ad_Impressions: 0, Calculated_Ad_Impressions: 0, Revenue: 0, calculatedRevenue: 0 }
    }


    let date = new Date();
    let firstDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    let lastDayLastDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

    await ModalReport.getUserReports({ Domain_name: "", userId:req.user.id, start_date: firstDayOfCurrentMonth, end_date: lastDayLastDayOfCurrentMonth}, async (err, response) => {
      if (!err && response) {
        // console.log('response', response);

        await Promise.all(
          response.map(respons =>{
            // console.log('respons', respons);
            respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            currentMonthStats.Ad_Requests += respons.Ad_Requests
            currentMonthStats.Ad_Impressions += respons.Ad_Impressions
            currentMonthStats.Calculated_Ad_Requests += respons.Calculated_Ad_Requests
            currentMonthStats.Calculated_Ad_Impressions += respons.Calculated_Ad_Impressions
            currentMonthStats.revenue += respons.Revenue
            currentMonthStats.calculatedRevenue += respons.Calculated_Revenue
          })
        )
      }
    });

    let firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth()-1, 1).toISOString().split('T')[0];
    let lastDayLastDayOfLastMonth = new Date(date.getFullYear(), date.getMonth() , 0).toISOString().split('T')[0];

    await ModalReport.getUserReports({ Domain_name: "", userId:req.user.id, start_date: firstDayOfLastMonth, end_date: lastDayLastDayOfLastMonth}, async (err, response) => {
      
      if (!err && response) {
        // console.log('response', response);

        await Promise.all(
          response.map(respons =>{
            // console.log('respons', respons);
            respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            lastMonthStats.Ad_Requests += respons.Ad_Requests
            lastMonthStats.Ad_Impressions += respons.Ad_Impressions
            lastMonthStats.Calculated_Ad_Requests += respons.Calculated_Ad_Requests
            lastMonthStats.Calculated_Ad_Impressions += respons.Calculated_Ad_Impressions
            lastMonthStats.revenue += respons.Revenue
            lastMonthStats.calculatedRevenue += respons.Calculated_Revenue
          })
        )
      }
    });

    let today = new Date().toISOString().split('T')[0]
    console.log('today', today);
    await ModalReport.getUserReports({ Domain_name: "", userId:req.user.id, start_date: today, end_date: today}, async (err, response) => {
      
      if (!err && response) {
        // console.log('response', response);

        await Promise.all(
          response.map(respons =>{
            console.log('respons', respons);
            respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            todayStats.Ad_Requests += respons.Ad_Requests
            todayStats.Ad_Impressions += respons.Ad_Impressions
            todayStats.Calculated_Ad_Requests += respons.Calculated_Ad_Requests
            todayStats.Calculated_Ad_Impressions += respons.Calculated_Ad_Impressions
            todayStats.revenue += respons.Revenue
            todayStats.calculatedRevenue += respons.Calculated_Revenue
          })
        )
      }
    });

    let yesterDay = new Date()
    yesterDay.setDate(yesterDay.getDate()-1)
    yesterDay = yesterDay.toISOString().split('T')[0]
    console.log('yesterDay', yesterDay);

    await ModalReport.getUserReports({ Domain_name: "", userId:req.user.id, start_date: yesterDay, end_date: yesterDay}, async (err, response) => {
      
      if (!err && response) {
        console.log('response', response);

        await Promise.all(
          response.map(respons =>{
            // console.log('respons', respons);
            respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            yesterdayStats.Ad_Requests += respons.Ad_Requests
            yesterdayStats.Ad_Impressions += respons.Ad_Impressions
            yesterdayStats.Calculated_Ad_Requests += respons.Calculated_Ad_Requests
            yesterdayStats.Calculated_Ad_Impressions += respons.Calculated_Ad_Impressions
            yesterdayStats.revenue += respons.Revenue
            yesterdayStats.calculatedRevenue += respons.Calculated_Revenue
          })
        )
      }
    });

    let firstDay = date.getDate() - date.getDay(); 
    let lastDay = firstDay + 6; 

    let firstDayThisWeek = new Date(date.setDate(firstDay)).toISOString().split('T')[0];
    let lastDayThisWeek = new Date(date.setDate(lastDay)).toISOString().split('T')[0];
    console.log('firstDayThisWeek', firstDayThisWeek, 'lastDayThisWeek', lastDayThisWeek);
    await ModalReport.getUserReports({ Domain_name: "", userId:req.user.id, start_date: firstDayThisWeek, end_date: lastDayThisWeek}, async (err, response) => {
      
      if (!err && response) {
        console.log('response', response);

        await Promise.all(
          response.map(respons =>{
            // console.log('respons', respons);
            respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            thisWeekStats.Ad_Requests += respons.Ad_Requests
            thisWeekStats.Ad_Impressions += respons.Ad_Impressions
            thisWeekStats.Calculated_Ad_Requests += respons.Calculated_Ad_Requests
            thisWeekStats.Calculated_Ad_Impressions += respons.Calculated_Ad_Impressions
            thisWeekStats.revenue += respons.Revenue
            thisWeekStats.calculatedRevenue += respons.Calculated_Revenue
          })
        )
      }
    });

    let date1 =new Date()
    let firstDay1 = date1.getDate() - date1.getDay()-7; 
    let lastDay1 = firstDay1 + 6; 

    let firstDayLastWeek = new Date(date1.setDate(firstDay1)).toISOString().split('T')[0];
    let lastDayLastWeek = new Date(date1.setDate(lastDay1)).toISOString().split('T')[0];
    console.log('firstDayPrevWeek', firstDayLastWeek, 'lastDayThisWeek', lastDayLastWeek);
    await ModalReport.getUserReports({ Domain_name: "", userId:req.user.id, start_date: firstDayLastWeek, end_date: lastDayLastWeek}, async (err, response) => {
      
      if (!err && response) {
        console.log('response', response);

        await Promise.all(
          response.map(respons =>{
            // console.log('respons', respons);
            respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            lastWeekStats.Ad_Requests += respons.Ad_Requests
            lastWeekStats.Ad_Impressions += respons.Ad_Impressions
            lastWeekStats.Calculated_Ad_Requests += respons.Calculated_Ad_Requests
            lastWeekStats.Calculated_Ad_Impressions += respons.Calculated_Ad_Impressions
            lastWeekStats.revenue += respons.Revenue
            lastWeekStats.calculatedRevenue += respons.Calculated_Revenue
          })
        )
      }
    });

    const currentYear = new Date().getFullYear();
    const currentYearFirstDay = new Date(currentYear, 0, 1);
    const currentYearLastDay = new Date(currentYear, 11, 31);

    await ModalReport.getUserReports({ Domain_name: "", userId:req.user.id, start_date: currentYearFirstDay, end_date: currentYearLastDay }, async (err, response) => {
      console.log('err :/'.err);
      if (!err && response) {
        console.log('response', response);

        await Promise.all(
          response.map(respons => {

            let createDate = new Date(respons.create_at)
            console.log('createDate.getMonth()', createDate.getMonth());
            if (createDate.getMonth() == 0) {
              monthwiseData.jan.Ad_Requests += respons.Ad_Requests
              monthwiseData.jan.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.jan.Revenue += respons.Revenue
              monthwiseData.jan.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.jan.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.jan.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 1) {
              monthwiseData.feb.Ad_Requests += respons.Ad_Requests
              monthwiseData.feb.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.feb.Revenue += respons.Revenue
              monthwiseData.feb.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.feb.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.feb.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 2) {
              monthwiseData.mar.Ad_Requests += respons.Ad_Requests
              monthwiseData.mar.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.mar.Revenue += respons.Revenue
              monthwiseData.mar.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.mar.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.mar.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 3) {
              monthwiseData.apr.Ad_Requests += respons.Ad_Requests
              monthwiseData.apr.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.apr.Revenue += respons.Revenue
              monthwiseData.apr.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.apr.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.apr.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 4) {
              monthwiseData.may.Ad_Requests += respons.Ad_Requests
              monthwiseData.may.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.may.Revenue += respons.Revenue
              monthwiseData.may.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.may.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.may.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 5) {
              monthwiseData.jun.Ad_Requests += respons.Ad_Requests
              monthwiseData.jun.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.jun.Revenue += respons.Revenue
              monthwiseData.jun.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.jun.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.jun.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 6) {
              monthwiseData.jul.Ad_Requests += respons.Ad_Requests
              monthwiseData.jul.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.jul.Revenue += respons.Revenue
              monthwiseData.jul.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.jul.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.jul.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 7) {
              monthwiseData.aug.Ad_Requests += respons.Ad_Requests
              monthwiseData.aug.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.aug.Revenue += respons.Revenue
              monthwiseData.aug.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.aug.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.aug.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 8) {
              monthwiseData.sep.Ad_Requests += respons.Ad_Requests
              monthwiseData.sep.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.sep.Revenue += respons.Revenue
              monthwiseData.sep.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.sep.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.sep.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 9) {
              monthwiseData.oct.Ad_Requests += respons.Ad_Requests
              monthwiseData.oct.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.oct.Revenue += respons.Revenue
              monthwiseData.oct.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.oct.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.oct.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 10) {
              monthwiseData.nov.Ad_Requests += respons.Ad_Requests
              monthwiseData.nov.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.nov.Revenue += respons.Revenue
              monthwiseData.nov.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.nov.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.nov.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
            if (createDate.getMonth() == 11) {
              monthwiseData.dec.Ad_Requests += respons.Ad_Requests
              monthwiseData.dec.Ad_Impressions += respons.Ad_Impressions
              monthwiseData.dec.Revenue += respons.Revenue
              monthwiseData.dec.Calculated_Ad_Requests += respons.Ad_Requests - respons.Ad_Requests * (parseFloat(("0." + respons.commission)))
              monthwiseData.dec.Calculated_Ad_Impressions += respons.Ad_Impressions - respons.Ad_Impressions * (parseFloat(("0." + respons.commission)))
              monthwiseData.dec.calculatedRevenue += respons.Revenue - respons.Revenue * (parseFloat(("0." + respons.commission)))
            }
          })
        )
      }
    });

    console.log('monthwiseData', monthwiseData);

    return res.json({
      message: "success",
      data: { thisWeekStats, lastWeekStats, todayStats, yesterdayStats, currentMonthStats, lastMonthStats},
      monthwiseData
    });
  } catch (e) {}
}


function addReport(req, res) {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let report = req.files.report;
      if (!report.mimetype.includes("csv")) {
        return res.send({
          status: false,
          message: "Please upload only csv file.",
        });
      }

      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      report.mv(
        "./uploads/" + Math.floor(new Date() / 1000) + "_" + report.name
      );

      let rows = [];
     

      const data = {
        file: Math.floor(new Date() / 1000) + "_" + report.name,
        commission: req.body.commission,
        create_at: new Date(req.body.date),
        updated_at: new Date(req.body.date),
      };

      db_write.query("INSERT INTO files SET ? ", [data], function (err, res) {
        if (err) {
          console.log("error: ", err);
        } else {
          console.log("error: ", res);
        }
      });
      
      let path =
      "./uploads/" + Math.floor(new Date() / 1000) + "_" + report.name;

      fs.createReadStream(path)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
          throw error.message;
        })
        .on("data", (row) => {
          let final_row = {
            Domain_name: row["Domain name"],
            Ad_Requests: row["Ad Requests"],
            Ad_Impressions: row["Ad Impressions"],
            Revenue: row["Revenue (USD)"],
            eCPM: row["eCPM"],
            commission: req.body.commission,
            create_at: new Date(req.body.date),
            updated_at: new Date(req.body.date),
          };
          rows.push(final_row);
        })
        .on("end", () => {
          ModalReport.addReport(rows, (err, response) => {
            if (!err && response) {
              return res.json({
                message: "Report imported successfully!",
                status: true,
              });
            }
            return res.status(401).send(err);
          });
        });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}


function deleteFile(req, res) {
  try {
    const fileId = req.params.id;

    ModalReport.deleteFile(fileId, (err, response) => {
        if (!err && response) {
          return res.json({
            message: "File Deleted successfully!",
            status: true,
          });
        }
        return res.status(401).send(err);
      });
   
  } catch (err) {
    res.status(500).send(err.message);
  }
}


module.exports = { addReport, getAllFiles,deleteFile, getHomeStats, getHomeStatsFixed, getUserHomeStats,getUserHomeStatsFixed };