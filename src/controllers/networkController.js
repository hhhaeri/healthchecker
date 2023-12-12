// const NetworkModel = require('../models/serviceModel');
// const HttpException = require('../utils/HttpException.utils');
// const { podMetric, nodeMetric } = require('../metricList');
// const dotenv = require('dotenv');
// dotenv.config();

// /******************************************************************************
//  *                              Network Controller
//  ******************************************************************************/
// class NetworkController {
//   getAllData = async (req, res, next) => {
//     let dataList;
//     if(req.query.clusterType !== undefined) dataList = await ClusterModel.findOne(req.query)
//     else dataList = await ClusterModel.find();

//     if (!dataList.length) {
//       throw new HttpException(404, "Data not found");
//     }

//     var clusterName = [];
//     var clusterType = [];
//     var clusterCode = [];
//     var status = [];

//     for (var i = 0; i < dataList.length; i++) {
//       clusterName[i] = dataList[i]["clusterName"];
//       clusterType[i] = dataList[i]["clusterType"];
//       clusterCode[i] = dataList[i]["clusterCode"];
//       status[i] = (dataList[i]["status"] ? "running" : "Notrunning");
//     }

//     res.status(200).json(dataList);
// };

// checkValidation = (req) => {
//   const errors = validationResult(req)
//   if (!errors.isEmpty()) {
//     throw new HttpException(400, 'Validation faild', errors);
//   }
// };
// }

// /******************************************************************************
//  *                               Export
//  ******************************************************************************/
// module.exports = new NetworkController;
