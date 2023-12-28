
const dotenv = require('dotenv');
const fs = require('fs').promises;
const yaml = require('js-yaml');
const { Client } = require('ssh2');
const sshConfig = require('../configs/sshConfig');
dotenv.config();

/******************************************************************************
 *                              Network Controller
 ******************************************************************************/
class NetworkController {
    networkCheck = async (req, res, next) => {

        const filePath = 'src/configs/check.yaml';

        try {
            const data = await fs.readFile(filePath, 'utf8');
            const parsedData = yaml.load(data);
            const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];

            const network = dataArray[0].network;

            const networkList = network.map(item => {
                const command = item.kind === 'host' ? `ping -w 1 ${item.ip}` : `nc -zvw1 ${item.ip} ${item.port}`;
                return {
                    name: item.name,
                    kind: item.kind,
                    command: command,
                    ...(item.kind === 'port' && { protocol: item.protocol }),
                };
            });

            const result = [];

            const conn = new Client();

            conn.on('ready', () => {
                executeCommands(networkList);
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
                    if (err) {
                        console.error(`Error executing command: ${command}\n${err}`);
                        res.status(500).send('Internal Server Error');
                        return;
                    }

                    let output = '';
                    let errorOutput = '';

                    stream.on('data', data => {
                        output += data.toString();
                    });

                    stream.stderr.on('data', data => {
                        errorOutput += data.toString();
                    });

                    stream.on('close', (code, signal) => {

                        if (commandObj.kind === "host") {
                            if (output.includes(", 0% packet loss,")) {
                                result.push({
                                    name: commandObj.name,
                                    status: 'ok',
                                });
                            } else if (output.includes("100% packet loss")) {
                                result.push({
                                    name: commandObj.name,
                                    status: 'error',
                                });
                            }
                        } else if (commandObj.kind === "port") {
                            if (errorOutput.includes("succeeded!")) {
                                result.push({
                                    name: commandObj.name,
                                    status: 'ok',
                                });
                            } else if (errorOutput.includes("failed:") || errorOutput.includes("timed out:")) {
                                result.push({
                                    name: commandObj.name,
                                    status: 'error',
                                });
                            }
                        }

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
