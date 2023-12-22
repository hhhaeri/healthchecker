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
dotenv.config();

/******************************************************************************
 *                              Service Controller
 ******************************************************************************/
class NetworkController {
    networkCheck = async (req, res, next) => {

        const filePath = 'src/configs/check.yaml';

        try {
            const data = await fs.readFile(filePath, 'utf8');
            const parsedData = yaml.load(data);
            const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];

            const network = dataArray[0].network;

            const sshConfig = {
                host: '192.168.160.131',
                port: 22,
                username: 'ubuntu',
                password: 'qwe1212!Q',
            };

            const networkList = network.map(item => {
                const command = item.kind === 'host' ? `ping -w 1 ${item.ip}` : `netstat -an | grep LISTEN | grep ${item.ip}:${item.port}`;
                return {
                    name: item.name,
                    kind: item.kind,
                    command: command,
                    ...(item.kind === 'port' && { protocol: item.protocol }),
                };
            });

            const result = [];

            console.log("networkList", networkList);

            const conn = new Client();

            conn.on('ready', () => {
                executeCommands(networkList);
            });

            function executeCommands(commandObjList) {
                if (!commandObjList || commandObjList.length === 0) {
                    console.log('실행할 명령어가 없습니다.');
                    conn.end(); // Close the connection
                    res.send(result);
                    return;
                }

                const commandObj = commandObjList.shift();
                const command = commandObj.command;

                conn.exec(command, (err, stream) => {
                    if (err) {
                        console.error(`Error executing command: ${command}\n${err}`);
                        res.status(500).send('Internal Server Error');
                        return;
                    }

                    let output = '';

                    stream.on('data', data => {
                        output += data.toString();
                        // Check if "icmp_seq=2" is present in the output
                      if (output.includes("icmp_seq=1")) {
                            // Set status to 'ok' and close the stream to end the execution
                            result.push({
                                name: commandObj.name,
                                status: 'ok',
                                output: output.trim(),
                            });
                        }else if(output.includes("bytes of data")) {
                          // Set status to 'error' and close the stream to end the execution
                          result.push({
                              name: commandObj.name,
                              status: 'error',
                              output: output.trim(),
                          });
                      }
                    });

                    stream.on('close', (code, signal) => {
                        console.log('Command:', command);
                        console.log('Signal:', signal);
                        console.log('Output:', output.trim());

                        // Execute the next command
                        executeCommands(commandObjList);
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
module.exports = new NetworkController;
