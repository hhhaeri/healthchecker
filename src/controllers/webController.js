const webModel = require('../models/webModel');
const dotenv = require('dotenv');
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

    let dataList = await webModel.check(dataArray[0].web);

    // hardcode
    let dataList2 = [
      {
        name: 'web01', 
        url: 'http://192.168.0.100:3000',
        status: "ok"
      },
      {
        name: 'web02', 
        url: 'http://192.168.0.100:3001',
        status: "error"
      }
    ]
    res.send(dataList2);
  };
}
/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new WebController;
