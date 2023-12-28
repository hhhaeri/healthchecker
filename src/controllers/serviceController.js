const ServiceModel = require('../models/serviceModel');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const axios = require('axios');
const request = require('request');
const dotenv = require('dotenv');
const util = require("util");
const fs = require('fs').promises;
const yaml = require('js-yaml');
const { Client } = require('ssh2');
const sshConfig = require('../configs/sshConfig');
dotenv.config();

/******************************************************************************
 *                              Service Controller
 ******************************************************************************/
class ServiceController {
    serviceCheck = async (req, res, next) => {

        const filePath = 'src/configs/check.yaml';

        try {
            const data = await fs.readFile(filePath, 'utf8');
            const parsedData = yaml.load(data);
            const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];

            const service = dataArray[0].service;

            const serviceList = service.map(item => ({
                name: item.name,
                command: `systemctl status ${item.name}`
            }));

            const result = [];

            const conn = new Client();

            conn.on('ready', () => {
                executeCommands(serviceList);
            });

            function executeCommands(commandObjList) {
                if (!commandObjList || commandObjList.length === 0) {
                    conn.end(); // Close the connection
                    res.send(result);
                    return;
                }

                const commandObj = commandObjList.shift();
                const command = commandObj.command;

                conn.exec(command, (err, stream) => {
                    if (err) throw err;
                    let output = '';
                    stream
                        .on('data', data => (output += data.toString()))
                        .on('close', (code, signal) => {

                            let status = 'error';
                            if (code === 0) {
                                status = 'ok';
                            }

                            result.push({
                                name: commandObj.name,
                                status: status,
                            });
                            executeCommands(commandObjList); // Recursively execute the next command
                        });
                });
            }

            conn.connect(sshConfig);

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    };
}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new ServiceController;