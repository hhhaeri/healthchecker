const webModel = require('../models/webModel');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const axios = require('axios');
const dotenv = require('dotenv');
const request = require('request')
dotenv.config();

/******************************************************************************
 *                              Web Controller
 ******************************************************************************/
class WebController {
  webCheck = async (req, res, next) => {
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

