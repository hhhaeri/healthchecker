const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error.middleware');
const webRouter = require('./routes/webRoute.js');
const mailling = require('./mailling/mailling.js');
// const serviceRouter = require('./routes/serviceRoute.route');
// const networkRouter = require('./routes/networkRoute.route');
const auto = require("node-schedule");
global.web123status = false;
// Init express
const app = express();
// Init environment
dotenv.config();
// console.log(process.env);
// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json());
// enabling cors for all requests by using cors middleware
app.use(cors());
// Enable pre-flight
app.options("*", cors());

const port = Number(process.env.PORT || 18000);

app.use(`/api/v1/web`, webRouter);
// app.use(`/api/v1/service`, serviceRouter);
// app.use(`/api/v1/network`, networkRouter);

// 404 error
app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});

// Error middleware
app.use(errorMiddleware);

// starting the server
app.listen(port, () =>
    console.log(`🚀 Server running on port ${port}!`));


var j = auto.scheduleJob("0/2 * * * * *", async function() {
    if(web123status === false){
        await mailling.main()
    } else {
        await setTimeout(() =>{
            web123status = false;
        },4000);
    }
});
auto.

module.exports = app;
