const nodemailer = require('nodemailer');

class maillingModel {
  mailling = async (subject, text) => {
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
      
    // send mail with defined transport object
    let info = await transporter.sendMail({  
      from: process.env.NODEMAILER_USER,
      to: "dj622@innogrid.com",
      subject: subject,
      text: text,
      html: `<b>`+text+`</b>`,
    });
  }
}

module.exports = new maillingModel;