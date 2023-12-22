const webModel = require('../models/webModel');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const axios = require('axios');
const dotenv = require('dotenv');
const request = require('request')
const fs = require('fs').promises;
const yaml = require('js-yaml');
const util = require('util');
dotenv.config();

/******************************************************************************
 *                              Web Controller
 ******************************************************************************/
class WebController {

  webCheck = async (req, res, next) => {

    const filePath = 'src/configs/check.yaml';

    const data = await fs.readFile(filePath, 'utf8');
    const parsedData = yaml.load(data);
    const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];

    console.log(util.inspect(dataArray, false, null, true));


    var headers = {
      'Content-Type': 'application/json'
    };

    var options = {
      url: 'http://registry.fems.cf',
      method: 'GET',
      headers: headers
    };

    var result2 = await new Promise((resolve, reject) => {
      request(options, function(error, res){
        if(error){
	  console.log(error)
          reject(error);
        } else{
	  resolve(res);
        }
      })
    });

    res.send("curl status : " + result2.statusCode);
  };
}
/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new WebController;

