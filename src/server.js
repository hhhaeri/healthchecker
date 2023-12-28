const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error.middleware');
const webRouter = require('./routes/webRoute.js');
const serviceRouter = require('./routes/serviceRoute.js');
const networkRouter = require('./routes/networkRoute.js');
const mailling = require('./mailling/mailling.js');
const auto = require("node-schedule");

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
app.use(`/api/v1/service`, serviceRouter);
app.use(`/api/v1/network`, networkRouter);

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


// mailling
mailling.readFileAndInitialize();

auto.scheduleJob("0/10 * * * * *", async function(){
    if(mailling.webdataList){
        await mailling.webCheckAndMailling();
    }
})

auto.scheduleJob("0 0 0 * *", async function(){
    await mailling.resetStatus();
});

module.exports = app;
