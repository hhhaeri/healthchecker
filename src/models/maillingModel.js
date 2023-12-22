const nodemailer = require('nodemailer');

class maillingModel {
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
          to: "cky@innogrid.com",
          subject: 'MSG',
          text: "Testing Message...",
          html: `<b>Testing Message...</b>`,
        });
        
        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
    
    resetStatus = async () => {
        global.checkStatus = global.checkStatus.map(function(status){
            return status = "ok"
        });
    }
}

module.exports = new maillingModel;