const dotenv = require('dotenv');
const fs = require('fs').promises;
const yaml = require('js-yaml');
const networkModel = require('../models/networkModel')
dotenv.config();

class NetworkController {
    networkCheck = async (req, res, next) => {
        const filePath = 'src/configs/check.yaml';
        const data = await fs.readFile(filePath, 'utf8');
        const parsedData = yaml.load(data);
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        
        let dataList = await networkModel.check(dataArray[0].network);

        res.send(dataList);
    };
}

module.exports = new NetworkController;