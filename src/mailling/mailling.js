const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const yaml = require('js-yaml');
const webModel = require('../models/webModel');
const serviceModel = require('../models/serviceModel');
const networkModel = require('../models/networkModel');

const dotenv = require('dotenv');

dotenv.config();

let count = [0, 0, 0];

class mailling {
    
    main = async () => {
        const filePath = 'src/configs/check.yaml';

        const data = await fs.readFile(filePath, 'utf8');
        const parsedData = yaml.load(data);
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];

        // let webCheckData = await webModel.check(dataArray[0].web);
        // let serviceCheckData = await serviceModel.check(dataArray[0].service);
        // let networkCheckData = await networkModel.check(dataArray[0].network);

        console.log("hi");
        global.web123status = true;
    }

    mailling = async (msg) => {
        let transporter = nodemailer.createTransport({
          service: 'Google',
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
          },
        });
        console.log(process.env.NODEMAILER_USER);
        console.log(process.env.NODEMAILER_PASS);
          
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: process.env.NODEMAILER_USER,
          to: "dj622@innogrid.com",
          subject: 'TEST MSG',
          text: "Testing Message...",
          html: `<b>Testing Message...</b>`,
        });
        
        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      }
}

module.exports = new mailling();